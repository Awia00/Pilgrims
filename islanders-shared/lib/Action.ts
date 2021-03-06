import { MatrixCoordinate } from './MatrixCoordinate';
import { HexCoordinate } from './HexCoordinate';
import { DevelopmentCard } from './Entities/DevelopmentCard';
import { Resources } from './Resources';
import { TileType } from './Shared';
import { HarborType } from './Tile';

interface HasPlayerName {
  playerName: string;
}
interface BuildHouseParameters extends HasPlayerName {
  coordinates: MatrixCoordinate;
}
interface BuildCityParameters extends HasPlayerName {
  coordinates: MatrixCoordinate;
}
interface BuildRoadParameters extends HasPlayerName {
  start: MatrixCoordinate;
  end: MatrixCoordinate;
}
interface MoveThiefParameters extends HasPlayerName {
  coordinates: HexCoordinate;
}
interface MoveThiefDevCardParameters extends HasPlayerName {
  coordinates: HexCoordinate;
}
interface StealFromPlayerParameters extends HasPlayerName {
  toStealFrom: string;
}
interface PlayerTradeParameters extends HasPlayerName {
  otherPlayerName: string;
  sentResources: Resources;
  receivedResources: Resources;
}
interface ProposeTradeParameters extends HasPlayerName {
  resources: Resources;
  wantsResources: Resources;
}
interface BankTradeParameters extends HasPlayerName {
  transfer: Resources;
  receive: Resources;
}
interface HarborTradeParameters extends HasPlayerName {
  harborType: HarborType;
  transfer: Resources;
  receive: Resources;
}
interface PlayCardParameters extends HasPlayerName {
  card: DevelopmentCard;
  chosenResources?: [TileType] | [TileType, TileType];
}
type BuyCardParameters = HasPlayerName
type EndTurnParameters = HasPlayerName

export class BuildHouseAction {
  public type: 'buildHouse' = 'buildHouse';

  public parameters: BuildHouseParameters;

  constructor(playerName: string, coordinates: MatrixCoordinate) {
    this.parameters = {
      playerName, coordinates,
    };
  }
}

export class BuildHouseInitialAction {
  public type: 'buildHouseInitial' = 'buildHouseInitial';

  public parameters: BuildHouseParameters;

  constructor(playerName: string, coordinates: MatrixCoordinate) {
    this.parameters = {
      playerName, coordinates,
    };
  }
}

export class BuildCityAction {
  public type: 'buildCity' = 'buildCity';

  public parameters: BuildCityParameters;

  constructor(playerName: string, coordinates: MatrixCoordinate) {
    this.parameters = {
      playerName, coordinates,
    };
  }
}

export class BuildRoadAction {
  public type: 'buildRoad' = 'buildRoad';

  public parameters: BuildRoadParameters;

  constructor(
    playerName: string,
    start: MatrixCoordinate,
    end: MatrixCoordinate,
  ) {
    this.parameters = {
      playerName, start, end,
    };
  }
}

export class BuildRoadInitialAction {
  public type: 'buildRoadInitial' = 'buildRoadInitial';

  public parameters: BuildRoadParameters;

  constructor(
    playerName: string,
    start: MatrixCoordinate,
    end: MatrixCoordinate,
  ) {
    this.parameters = {
      playerName, start, end,
    };
  }
}

export class MoveThiefDevCardAction {
  public type: 'moveThiefDevelopmentCard' = 'moveThiefDevelopmentCard';

  public parameters: MoveThiefDevCardParameters;

  constructor(
    playerName: string,
    coordinates: HexCoordinate,
  ) {
    this.parameters = {
      playerName, coordinates,
    };
  }
}

export class StealFromPlayerAction {
  public type: 'stealFromPlayer' = 'stealFromPlayer';

  public parameters: StealFromPlayerParameters;

  constructor(
    playerName: string,
    toStealFrom: string,
  ) {
    this.parameters = {
      playerName,
      toStealFrom,
    };
  }
}

export class MoveThiefAction {
  public type: 'moveThief' = 'moveThief';

  public parameters: MoveThiefParameters;

  constructor(playerName: string, coordinates: HexCoordinate) {
    this.parameters = {
      playerName, coordinates,
    };
  }
}

export class PlayerTradeAction {
  public type: 'playerTrade' = 'playerTrade';

  public parameters: PlayerTradeParameters;

  constructor(
    playerName: string,
    otherPlayerName: string,
    sentResources: Resources,
    receivedResources: Resources,
  ) {
    this.parameters = {
      playerName, otherPlayerName, sentResources, receivedResources,
    };
  }
}

export class ProposeTradeAction {
  public type: 'proposeTrade' = 'proposeTrade';

  public parameters: ProposeTradeParameters;

  constructor(
    playerName: string,
    resources: Resources,
    wantsResources: Resources,
  ) {
    this.parameters = {
      playerName, resources, wantsResources,
    };
  }
}

export class BankTradeAction {
  public type: 'bankTrade' = 'bankTrade';

  public parameters: BankTradeParameters;

  constructor(playerName: string, transfer: Resources, receive: Resources) {
    this.parameters = {
      playerName, transfer, receive,
    };
  }
}

export class HarborTradeAction {
  public type: 'harborTrade' = 'harborTrade';

  public parameters: HarborTradeParameters;

  constructor(
    playerName: string,
    harborType: HarborType,
    transfer: Resources,
    receive: Resources,
  ) {
    this.parameters = {
      playerName, harborType, transfer, receive,
    };
  }
}

export class BuyCardAction {
  public type: 'buyCard' = 'buyCard';

  public parameters: BuyCardParameters;

  constructor(playerName: string) {
    this.parameters = {
      playerName,
    };
  }
}

export class PlayCardAction {
  public type: 'playCard' = 'playCard';

  public parameters: PlayCardParameters;

  constructor(
    playerName: string,
    card: DevelopmentCard,
    chosenResources?: [TileType] | [TileType, TileType],
  ) {
    this.parameters = {
      playerName, card, chosenResources,
    };
  }
}

export class EndTurnAction {
  public type: 'endTurn' = 'endTurn';

  public parameters: EndTurnParameters;

  constructor(playerName: string) {
    this.parameters = {
      playerName,
    };
  }
}

export class LockMapAction {
  public pointsToWin: number;
  public type: 'lockMap' = 'lockMap';

  constructor(pointsToWin: number) {
    this.pointsToWin = pointsToWin;
  }
}

export class UndoAction {
  public type: 'undo' = 'undo';
}

// An action is an closure which has the information necessary to perform one rule on a world.
export type Action =
  | BuildHouseAction
  | BuildHouseInitialAction
  | BuildCityAction
  | BuildRoadAction
  | BuildRoadInitialAction
  | MoveThiefAction
  | MoveThiefDevCardAction
  | StealFromPlayerAction
  | PlayerTradeAction
  | ProposeTradeAction
  | BankTradeAction
  | HarborTradeAction
  | PlayCardAction
  | BuyCardAction
  | LockMapAction
  | EndTurnAction
  | UndoAction;
