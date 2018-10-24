import { Result, success, fail } from './Result';
import { World } from './World';
import { MatrixCoordinate } from './MatrixCoordinate';
import {
  Resources,
  subtractResources,
  resourcesAreNonNegative,
  addResources,
} from './Resources';
import { Road } from './Entities/Road';
import { City } from './Entities/City';
import { House } from './Entities/House';
import {
  BuildHouseAction,
  BuildCityAction,
  BuildRoadAction,
  PlaceThiefAction,
  BuyCardAction,
  PlayCardAction,
  TradeAction,
  EndTurnAction,
} from './Action';
import {
  neighbouringMatrixCoords,
  neighbouringHexCoords,
  Tile,
  Player,
} from './Shared';
import { randomDiceRoll } from './WorldGenerator';

export type Rule = (w: Result<World>) => Result<World>;
export interface Rules {
  BuildHouse: (data: BuildHouseAction) => (w: Result<World>) => Result<World>;
  BuildCity: (data: BuildCityAction) => (w: Result<World>) => Result<World>;
  BuildRoad: (data: BuildRoadAction) => (w: Result<World>) => Result<World>;
  MoveThief: (data: PlaceThiefAction) => (w: Result<World>) => Result<World>;
  BuyCard: (data: BuyCardAction) => (w: Result<World>) => Result<World>;
  PlayCard: (data: PlayCardAction) => (w: Result<World>) => Result<World>;
  Trade: (data: TradeAction) => (w: Result<World>) => Result<World>;
  EndTurn: (data: EndTurnAction) => (w: Result<World>) => Result<World>;
}

export const ruleReducer = (
  acc: Result<World>,
  curr: ((x: Result<World>) => Result<World>),
) => curr(acc);

//
// ---- Rule implementations ----
//
export const rules: Rules = {
  BuildHouse: ({ type, parameters }) => (w) => {
    if (w.tag === 'Failure') {
      return w;
    }
    const playerExists = findPlayer(parameters.playerName)(w);
    const purchased = purchase(new House().cost)(parameters.playerName)(
      playerExists,
    );
    const placed = placeHouse(parameters.coordinates)(parameters.playerName)(
      purchased,
    );
    return placed;
  },
  BuildCity: ({ type, parameters }) => (w) => {
    if (w.tag === 'Failure') {
      return w;
    }
    const playerExists = findPlayer(parameters.playerName)(w);
    const purchased = purchase(new City().cost)(parameters.playerName)(
      playerExists,
    );
    return placeCity(parameters.coordinates)(parameters.playerName)(purchased);
  },
  BuildRoad: ({ type, parameters }) => (w) => {
    if (w.tag === 'Failure') {
      return w;
    }
    const playerExists = findPlayer(parameters.playerName)(w);
    const purchased = purchase(new Road().cost)(parameters.playerName)(
      playerExists,
    );
    return placeRoad(parameters.start, parameters.end)(parameters.playerName)(
      purchased,
    );
  },
  MoveThief: ({ type, parameters }) => (w) => w,
  BuyCard: ({ type, parameters }) => (w) => w,
  PlayCard: ({ type, parameters }) => (w) => w,
  Trade: ({ type, parameters }) => (w) => w,
  EndTurn: ({ type, parameters }) => (w) => {
    if (w.tag === 'Failure') {
      return w;
    }
    const diceRoll = randomDiceRoll();
    const players: Player[] = w.value.players.map((pl) => {
      let allTiles: { tile: Tile; amt: number }[] = w.value.map
        .filter((tile) => {
          //tile.diceRoll !== diceRoll &&
          return !(
            w.value.thief &&
            (w.value.thief.hexCoordinate.x === tile.coord.x &&
              w.value.thief.hexCoordinate.y === tile.coord.y)
          );
        })
        .map((tile) => {
          const houseAmt = pl.houses.reduce((state: number, curr: House) => {
            const hexes = neighbouringHexCoords(curr.position);
            for (let i = 0; i < 3; i++) {
              if (hexes[i].x === tile.coord.x && hexes[i].y === tile.coord.y)
                return state + 1;
            }
            return state;
          }, 0);
          const cityAmt = pl.cities.reduce((state: number, curr: House) => {
            const hexes = neighbouringHexCoords(curr.position);
            for (let i = 0; i < 3; i++) {
              if (hexes[i].x === tile.coord.x && hexes[i].y === tile.coord.y)
                return state + 2;
            }
            return state;
          }, 0);
          return { tile: tile, amt: houseAmt + cityAmt };
        });
      const resources: Resources = allTiles
        .filter((pair) => pair.amt !== 0)
        .reduce((state, pair) => {
          return addResources(state, {
            [pair.tile.type.toLowerCase()]: pair.amt,
          });
        }, pl.resources);
      return { ...pl, resources: resources };
    });
    return success({ ...w.value, players: players });
  },
};

export const purchase = (cost: Resources) => (playerName: string) => (
  r: Result<World>,
) => {
  if (r.tag === 'Failure') {
    return r;
  }
  const resources = subtractResources(
    r.value.players.find((pl) => pl.name === playerName)!.resources,
    cost,
  );
  if (!resourcesAreNonNegative(resources)) {
    return fail(`Player ${playerName} cannot afford this.`);
  }
  const players = r.value.players.map(
    (pl) => (pl.name === playerName ? { ...pl, resources } : pl),
  );
  return success({ ...r.value, players });
};

const findPlayer = (name: string) => (r: Result<World>): Result<World> => {
  if (r.tag === 'Failure') {
    return r;
  }
  const player = r.value.players.find((pl) => pl.name === name);
  if (!player) {
    return fail(`Player ${name} not found.`);
  }
  return success(r.value);
};

const placeHouse = (coord: MatrixCoordinate) => (playerName: string) => (
  world: Result<World>,
) => {
  if (world.tag === 'Failure') {
    return world;
  }
  const allHouses = world.value.players.reduce(
    (acc: House[], p) => acc.concat(p.houses),
    [],
  );
  const neighbouring = neighbouringMatrixCoords(coord);
  const canPlace = !allHouses.some(
    (h) =>
      (h.position.x === coord.x && h.position.y === coord.y) ||
      neighbouring.some(
        (pos) => pos.x === h.position.x && pos.y === h.position.y,
      ),
  );
  if (!canPlace) {
    return fail('Cannot place a house here!');
  }
  const players = world.value.players.map(
    (pl) =>
      pl.name === playerName
        ? { ...pl, houses: pl.houses.concat([new House(coord)]) }
        : pl,
  );
  return success({ ...world.value, players });
};

const placeCity = (coord: MatrixCoordinate) => (playerName: string) => (
  r: Result<World>,
) => {
  if (r.tag === 'Failure') {
    return r;
  }
  const player = r.value.players.find((pl) => pl.name === playerName)!;
  const canPlace = player.houses.some(
    (h) => h.position.x === coord.x && h.position.y === coord.y,
  );

  if (!canPlace) {
    return fail('Cannot place a house here!');
  }
  const houses = player.houses.filter(
    (h) => !(h.position.x === coord.x && h.position.y === coord.y),
  );
  const cities = player.cities.concat([new City(coord)]);
  const players = r.value.players.map(
    (pl) =>
      pl.name === playerName ? { ...pl, houses: houses, cities: cities } : pl,
  );
  return success({ ...r.value, players });
};

const placeRoad = (start: MatrixCoordinate, end: MatrixCoordinate) => (
  playerName: string,
) => (r: Result<World>) => {
  if (r.tag === 'Failure') {
    return r;
  }
  const player = r.value.players.find((pl) => pl.name === playerName)!;

  const canPlace = player.roads.some(
    (ro) => ro.start !== start && ro.end !== end,
  );
  if (!canPlace) {
    return fail('Cannot place a road here!');
  }
  const roads = player.roads.concat([new Road(start, end)]);
  const players = r.value.players.map(
    (pl) => (pl.name === playerName ? { ...pl, roads } : pl),
  );
  return success({ ...r.value, players });
};
