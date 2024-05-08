import { Player } from "./Player";
import { Team } from "./Team";

export class CreatePlayerDto {
  name: string;
  email: string;
  nickName?: string;
  age?: number;
}

export class UpdatePlayerDto {
  name: string;
  email: string;
  nickName?: string;
  age?: number;
}

export class CreateGameDto {
  date: Date;
  location: string;
}

export class UpdateGameDto {
  date: Date;
  location: string;
  scoreTeam1?: number;
  scoreTeam2?: number;
  team1?: Team;
  team2?: Team;
  status: string;
}

export class AddPlayersToGameDto {
  players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }
}
