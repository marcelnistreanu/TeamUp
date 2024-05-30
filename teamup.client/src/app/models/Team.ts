import { Player } from "./Player";

export class Team {
  id: number;
  name?: string;
  players: Player[] = [];

  constructor() { }
}
