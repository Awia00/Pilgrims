import {
  World,
  Tile,
  SocketActions,
  success,
  fail,
  Result,
  Player,
  ruleReducer,
  Action,
  Rule,
  rules,
} from '../../../colonists-shared/dist/Shared';
import { GameRepository } from '../repositories/GameRepository';
import { Namespace } from 'socket.io';

export class GameService {
  private gameRepository: GameRepository;
  constructor(gameRepository: GameRepository) {
    this.gameRepository = gameRepository;
  }

  public async initWorld(
    init: World,
    gameID: string,
    namespace: Namespace,
  ) {
    if (!init) console.info(`[${gameID}] 'init_world' with empty message.`);
    if (!init || !gameID) return;
    console.info(`[${gameID}] 'init_world' with World:`);
    console.info(init);
    const r = await this.gameRepository.getWorld(gameID);
    r.flatMapAsync(async (w: World) => {
      if (w.gameState === 'Started') {
        await this.gameRepository.createGame(init)
        namespace.emit(SocketActions.newWorld, success(init));
        return success(w);
      }
      else return fail('The game has not been started!');
    })
  }

  public async updateMap(
    map: Tile[],
    gameID: string,
    namespace: Namespace,
  ) {
    const result = await this.gameRepository.getWorld(gameID);
    result.onFailure(r => {
      console.info(`[${gameID}] 'Failure' with reason: ${r}`);
    });
    return result.flatMapAsync(async (w: World) => {
      if (w.gameState === 'Started') {
        const failure = fail('You cannot update the map once the game has started!');
        namespace.emit(
          SocketActions.newWorld,
          failure
        );
        return failure;
      }

      w.map = map;
      await this.gameRepository.updateGame(gameID, w);
      namespace.emit(SocketActions.newWorld, result);
      return success(w);
    });
  }

  public async addPlayer(gameID: string, name: string): Promise<Result> {
    try {
      const result: Result = await this.gameRepository.getWorld(gameID);
      return result.flatMapAsync(async (w: World) => {
        if (w.gameState === 'Started') return success(w); // spectator mode
        const player = new Player(name);
        const players = w.players.concat([player]);
        players.sort((x, y) => x.name.localeCompare(y.name));
        const world = { ...w, players };
        await this.gameRepository.updateGame(gameID, world);
        return success(world);
      });
    } catch (ex) {
      return fail(`Could not add player ${name}! Ex: ${ex}`);
    }
  }

  public async applyAction(id: string, action: Action): Promise<Result> {
    console.log(`Applying action ${action.type}`);
    const toApply = this.mapRules([action]);
    const result = await this.gameRepository.getWorld(id);
    const apply = toApply.reduce(ruleReducer, result);
    return apply.flatMapAsync(async (w: World) =>
      await this.gameRepository.updateGame(id, w)
    );
  }

  private mapRules(actions: Action[]): Rule[] {
    const mapped: (Rule | string)[] = actions.map((a) => {
      switch (a.type) {
        case 'buildCity':
          return rules.BuildCity(a);
        case 'buildHouse':
          return rules.BuildHouse(a);
        case 'buildHouseInitial':
          return rules.BuildHouseInitial(a);
        case 'buildRoad':
          return rules.BuildRoad(a);
        case 'buildRoadInitial':
          return rules.BuildRoadInitial(a);
        case 'buyCard':
          return rules.BuyCard(a);
        case 'playCard':
          return rules.PlayCard(a);
        case 'moveThief':
          return rules.MoveThief(a);
        case 'moveThiefDevelopmentCard':
          return rules.MoveThiefDevelopmentCard(a);
        case 'playerTrade':
          return rules.PlayerTrade(a);
        case 'bankTrade':
          return rules.BankTrade(a);
        case 'harborTrade':
          return rules.HarborTrade(a);
        case 'lockMap':
          return rules.LockMap(a);
        case 'endTurn':
          return rules.EndTurn(a);
        default:
          return `Could not map Action: { ${Object.keys(a).join(', ')} }!`;
      }
    });
    return mapped.filter((r) => typeof r === 'string') as Rule[];
  }
}