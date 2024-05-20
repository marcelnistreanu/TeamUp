import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'app/models/Game';
import { Player } from 'app/models/Player';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { GameService } from 'app/services/game.service';
import { UpdateGameDto, UpdateTeamsDto } from 'app/models/Dtos';
import { Team } from 'app/models/Team';

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

  playersTeam1: Player[] = [];
  playersTeam2: Player[] = [];

  onDrop(game: Game, event: any, team: string) {
    console.log('onDrop team: ', team);
    if (team == 'team1') {

      this.playersTeam2 = this.playersTeam2.filter(
        (p) => p.id !== this.currentPlayerDragged.id
      );

      this.playersTeam1.push(this.currentPlayerDragged);
    } else if (team == 'team2') {

      this.playersTeam1 = this.playersTeam1.filter(
        (p) => p.id !== this.currentPlayerDragged.id
      );
      this.playersTeam2.push(this.currentPlayerDragged);
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
    });
  }

  generateTeams() {
    this.playersTeam1 = [];
    this.playersTeam2 = [];

    let sortedPlayers = this.game.players.sort(
      (p1, p2) => p2.rating - p1.rating
    );

    let teamIndex = 0;

    sortedPlayers.forEach((p) => {
      if (teamIndex === 0) {
        this.playersTeam1?.push(p);
      } else if (teamIndex === 1) {
        this.playersTeam2.push(p);
      }
      teamIndex = (teamIndex + 1) % 2;
    });

    console.log('Sorted list: ', sortedPlayers);
  }

  dto: UpdateTeamsDto = new UpdateTeamsDto();
  team1: Team = new Team();
  team2: Team = new Team();


  saveGame() {
    console.log("Players team 1: ", this.playersTeam1);
    console.log("Players team 2: ", this.playersTeam2);

    this.team1.players = this.playersTeam1;
    this.team2.players = this.playersTeam2;

    this.dto.team1= this.team1;
    this.dto.team2 = this.team2;

    this.gameService.updateGameTeams(this.game.id, this.dto).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ovr: number;

  calculateRating(playersTeam: Player[]): number {
    this.ovr = 0;
    if (playersTeam) {
      playersTeam.forEach((player) => {
        if (player.rating !== undefined) {
          this.ovr = this.ovr + player.rating;
        }
      });
    }
    return this.ovr;
  }
}
