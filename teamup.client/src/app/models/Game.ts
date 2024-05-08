import { Player } from "./Player";
import { Team } from "./Team";

export class Game {
   id: number;
   date: Date;
   location: string;
   scoreTeam1?: number;
   scoreTeam2?: number;
   team1Id?: number;
   team1?: Team;
   team2Id?: number;
   team2?: Team;
   status: string;
   players: Player[];
}
