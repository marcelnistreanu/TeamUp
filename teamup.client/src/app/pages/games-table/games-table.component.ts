import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/Game';
import { TableModule } from 'primeng/table';
import { formatDate } from '@angular/common';
import localePt from '@angular/common/locales/pt';

@Component({
  selector: 'app-games-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './games-table.component.html',
  styleUrl: './games-table.component.css'
})
export class GamesTableComponent implements OnInit {

  constructor(private gameService: GameService) { }

  games: Game[] = [];

  ngOnInit(): void {
    this.gameService.getGames().subscribe(
      (response: any) => {
        console.log(response);
        this.games = response.value;

        console.log(this.games);
      },
      (error) => {
        console.error(error);
      }
    )
  }

}
