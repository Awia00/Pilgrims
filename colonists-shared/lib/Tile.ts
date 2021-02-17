import { HexCoordinate } from './HexCoordinate';

export type HarborType =
  | 'WoodHarbor'
  | 'WoolHarbor'
  | 'GrainHarbor'
  | 'ClayHarbor'
  | 'StoneHarbor'
  | 'ThreeToOneHarbor';
export type TileType =
  | 'Wood'
  | 'Stone'
  | 'Clay'
  | 'Grain'
  | 'Wool'
  | 'Desert'
  | 'Ocean'
  | HarborType;
export type DiceRoll =
  | 'None'
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
export type GeneratorDiceRollType =
  | 'None'
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 9
  | 10
  | 11
  | 12;
export interface Tile {
  type: TileType;
  diceRoll: DiceRoll;
  coord: HexCoordinate;
}
