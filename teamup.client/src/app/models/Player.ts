import { Game } from "./Game";
import { Team } from "./Team";

export class Player {
  id: number;
  name: string;
  email: string;
  nickName: string;
  dob?: Date;
  rating: number;
  games: Game[];
  team: Team[];
  selected: boolean;
}
