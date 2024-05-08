import { Game } from "./Game";

export class Player {
  id: number;
  name: string;
  email: string;
  nickName: string;
  age?: number;
  rating?: number;
  games: Game[];
  selected: boolean;
}
