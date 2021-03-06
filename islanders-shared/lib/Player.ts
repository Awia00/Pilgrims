import { Resources } from './Resources';
import { House } from './Entities/House';
import { City } from './Entities/City';
import { Road } from './Entities/Road';
import { Ship } from './Entities/Ship';
import { DevelopmentCard } from './Entities/DevelopmentCard';

export class Player {
  public color: number;

  public name: string;

  public resources: Resources;

  public knights: number;

  public houses: House[];

  public cities: City[];

  public roads: Road[];

  public ships: Ship[];

  public devCards: DevelopmentCard[];

  public points: number;

  constructor(name: string) {
    this.color = 0xffffff * Math.random();
    this.name = name;
    this.resources = {
      clay: 0,
      grain: 0,
      stone: 0,
      wood: 0,
      wool: 0,
    }; // todo reset to true values
    this.houses = [];
    this.cities = [];
    this.roads = [];
    this.ships = [];
    this.devCards = [];
    this.points = 0;
    this.knights = 0;
  }
}
