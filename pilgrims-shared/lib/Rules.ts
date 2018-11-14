import { Result } from './Rules/Result';
import { World } from './World';
import {
  BuildHouseAction,
  BuildCityAction,
  BuildRoadAction,
  PlaceThiefAction,
  BuyCardAction,
  PlayCardAction,
  TradeAction,
  EndTurnAction,
  LockMapAction,
  BuildHouseInitialAction,
  BuildRoadInitialAction,
} from './Action';
import { BuildHouse } from './Rules/BuildHouse';
import { BuildHouseInitial } from './Rules/BuildHouseInitial';
import { BuildCity } from './Rules/BuildCity';
import { BuildRoad } from './Rules/BuildRoad';
import { BuildRoadInitial } from './Rules/BuildRoadInitial';
import { MoveThief } from './Rules/MoveTheif';
import { BuyCard } from './Rules/BuyCard';
import { PlayCard } from './Rules/PlayCard';
import { Trade } from './Rules/Trade';
import { LockMap } from './Rules/LockMap';
import { EndTurn } from './Rules/EndTurn';

export type Rule = (w: Result<World>) => Result<World>;
export interface Rules {
  BuildHouse: (data: BuildHouseAction) => (w: Result<World>) => Result<World>;
  BuildHouseInitial: (
    data: BuildHouseInitialAction,
  ) => (w: Result<World>) => Result<World>;
  BuildCity: (data: BuildCityAction) => (w: Result<World>) => Result<World>;
  BuildRoad: (data: BuildRoadAction) => (w: Result<World>) => Result<World>;
  BuildRoadInitial: (
    data: BuildRoadInitialAction,
  ) => (w: Result<World>) => Result<World>;
  MoveThief: (data: PlaceThiefAction) => (w: Result<World>) => Result<World>;
  BuyCard: (data: BuyCardAction) => (w: Result<World>) => Result<World>;
  PlayCard: (data: PlayCardAction) => (w: Result<World>) => Result<World>;
  Trade: (data: TradeAction) => (w: Result<World>) => Result<World>;
  LockMap: (data: LockMapAction) => (w: Result<World>) => Result<World>;
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
  BuildHouse,
  BuildHouseInitial,
  BuildCity,
  BuildRoad,
  BuildRoadInitial,
  MoveThief,
  BuyCard,
  PlayCard,
  Trade,
  LockMap,
  EndTurn,
};
