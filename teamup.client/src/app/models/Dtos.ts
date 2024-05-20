import { Player } from "./Player";
import { Team } from "./Team";

export class CreatePlayerDto {
  name: string;
  email: string;
  nickName?: string;
  dob?: Date;
}

export class UpdatePlayerDto {
  name: string;
  email: string;
  nickName?: string;
  dob?: Date;
  rating: number;
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

export class UpdateTeamsDto {
  team1?: Team;
  team2?: Team;
}

export class AddPlayersToGameDto {
  players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }
}
