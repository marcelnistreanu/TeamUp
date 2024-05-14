import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'app/models/Game';
import { Player } from 'app/models/Player';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { GameService } from 'app/services/game.service';
import { UpdateGameDto } from 'app/models/Dtos';

@Component({
  selector: 'app-generate-teams-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, MatIcon],
  templateUrl: './generate-teams-dialog.component.html',
  styleUrl: './generate-teams-dialog.component.css',
})
export class GenerateTeamsDialogComponent implements OnInit {
  generateTeamsDialog: boolean = false;
  currentPlayerDragged: Player;

  constructor(
    public dialogRef: MatDialogRef<GenerateTeamsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public game: Game,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    console.log('Game in this dialog', this.game);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDragStart(player: Player) {
    console.log('onDragStart');
    this.currentPlayerDragged = player;
    console.log(this.currentPlayerDragged);
  }

  onDrop(game: Game, event: any, team: string) {
    console.log('onDrop team: ', team);
    if (team == 'team1') {
      game.team1?.players.push(this.currentPlayerDragged);

      if (game.team2?.players) {
        game.team2.players = game.team2.players.filter(
          (p) => p.id !== this.currentPlayerDragged.id
        );
      }
    } else if (team == 'team2') {
      game.team2?.players.push(this.currentPlayerDragged);

      if (game.team1?.players) {
        game.team1.players = game.team1.players.filter(
          (p) => p.id !== this.currentPlayerDragged.id
        );
      }
    }
  }

  onDragOver(event: any) {
    console.log('onDragOver');
    event.preventDefault();
  }

  games: Game[];

  getGames(): void {
      this.gameService.getGames().subscribe({
        next: (response) => {
          console.log(response);
          this.games = response.value;
        },
        error: (error) => {
          console.error(error);
        },
      })
  }

  generateTeams() {
      this.gameService.generateTeams(this.game.id).subscribe({
        next: (response) => {
          console.log(response);
          this.getGames();
        },
        error: (error) => {
          console.error(error);
        },
      })
  }

  dto: UpdateGameDto = new UpdateGameDto();

  saveGame() {
    console.log('Modified game: ', this.game);
    
  }
}
