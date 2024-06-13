import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'app/models/Game';
import { Player } from 'app/models/Player';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { GameService } from 'app/services/game.service';
import { UpdateGameDto, UpdateTeamsDto } from 'app/models/Dtos';
import { Team } from 'app/models/Team';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-generate-teams-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    MatIcon,
    TableModule,
    InputTextModule,
    MenuModule,
  ],
  templateUrl: './generate-teams-dialog.component.html',
  styleUrl: './generate-teams-dialog.component.css',
})
export class GenerateTeamsDialogComponent implements OnInit {
  generateTeamsDialog: boolean = false;
  currentPlayerDragged: Player;


  constructor(
    public dialogRef: MatDialogRef<GenerateTeamsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public game: Game,
    private gameService: GameService,
  ) {
    
  }

  playersTeam1: Player[] = [];
  playersTeam2: Player[] = [];
  selectedPlayers: Player[] = [];
  availablePlayersInAddGroupsDialog: Player[] = [];

  ngOnInit(): void {
    console.log('Game in this dialog', this.game);

    if (this.game.team1) this.playersTeam1 = this.game.team1?.players;
    if (this.game.team2) this.playersTeam2 = this.game.team2.players;

    this.availablePlayersInAddGroupsDialog = [...this.game.players];
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

  addGroups(): void {
    this.addGroupPlayersDialog = true;
  }

  addGroupPlayersDialog: boolean = false;
  hideAddGroupsPlayersDialog(): void {
    this.addGroupPlayersDialog = false;
  }

  playersGroups: Player[][] = [];

  addPlayersToGroup(): void {
    if (this.selectedPlayers.length > 0) {
      this.playersGroups.push([...this.selectedPlayers]);
      this.removeSelectedPlayersFromAvailable();
      this.selectedPlayers = []; // Clear the selection after adding to group
      this.hideAddGroupsPlayersDialog();
    }
  }

  removeSelectedPlayersFromAvailable(): void {
    this.availablePlayersInAddGroupsDialog =
      this.availablePlayersInAddGroupsDialog.filter(
        (player) => !this.selectedPlayers.includes(player)
      );
  }

  generateTeams() {
    this.playersTeam1 = [];
    this.playersTeam2 = [];
    let team1TotalRating = 0;
    let team2TotalRating = 0;

    console.log(this.playersGroups);

    // Shuffle the players array
    let shuffledPlayers = this.game.players
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Distribute players to balance the teams
    // shuffledPlayers.forEach((player) => {
    //   if (team1TotalRating <= team2TotalRating) {
    //     this.playersTeam1.push(player);
    //     team1TotalRating += player.rating;
    //   } else {
    //     this.playersTeam2.push(player);
    //     team2TotalRating += player.rating;
    //   }
    // });

    // Track which players are already assigned to a team
    let assignedPlayers = new Set<number>(); // Using player IDs for uniqueness
    let assignedGroupIndices = new Set<number>();

    // Function to add a player to a team
    const addToTeam = (player: Player, team: Player[], totalRating: number) => {
      team.push(player);
      assignedPlayers.add(player.id);
      totalRating += player.rating;
      return totalRating;
    };

    // Distribute players to balance the teams
    shuffledPlayers.forEach((player) => {
      if (assignedPlayers.has(player.id)) {
        // Skip players already assigned to a team
        return;
      }

      // Check if player belongs to any group
      const groupIndex = this.playersGroups.findIndex((group) =>
        group.includes(player)
      );

      if (groupIndex !== -1 && !assignedGroupIndices.has(groupIndex)) {
        // Player is part of a group, add the entire group to a team
        const group = this.playersGroups[groupIndex];
        if (team1TotalRating <= team2TotalRating) {
          group.forEach((groupPlayer) => {
            if (!assignedPlayers.has(groupPlayer.id)) {
              team1TotalRating = addToTeam(
                groupPlayer,
                this.playersTeam1,
                team1TotalRating
              );
            }
          });
        } else {
          group.forEach((groupPlayer) => {
            if (!assignedPlayers.has(groupPlayer.id)) {
              team2TotalRating = addToTeam(
                groupPlayer,
                this.playersTeam2,
                team2TotalRating
              );
            }
          });
        }

        // Add the group index to the assignedGroupIndices set
        assignedGroupIndices.add(groupIndex);
      } else {
        // Player is not part of a group, add individually to balance teams
        if (team1TotalRating <= team2TotalRating) {
          team1TotalRating = addToTeam(
            player,
            this.playersTeam1,
            team1TotalRating
          );
        } else {
          team2TotalRating = addToTeam(
            player,
            this.playersTeam2,
            team2TotalRating
          );
        }
      }
    });

    // If teams are unbalanced in terms of number of players, move players to balance them
    while (Math.abs(this.playersTeam1.length - this.playersTeam2.length) > 1) {
      if (this.playersTeam1.length > this.playersTeam2.length) {
        const player = this.playersTeam1.pop();
        if (player) {
          this.playersTeam2.push(player);
          team1TotalRating -= player.rating;
          team2TotalRating += player.rating;
        }
      } else {
        const player = this.playersTeam2.pop();
        if (player) {
          this.playersTeam1.push(player);
          team2TotalRating -= player.rating;
          team1TotalRating += player.rating;
        }
      }
    }

    console.log('Sorted list: ', shuffledPlayers);
    console.log('Team 1: ', this.playersTeam1, ' :', team1TotalRating);
    console.log('Team 2: ', this.playersTeam2, ' :', team2TotalRating);
  }

  selectedPlayer: Player | null = null;

  // Function to move player between teams
  movePlayer(player: Player, targetTeam: 'team1' | 'team2'): void {
    if (targetTeam === 'team1') {
      this.playersTeam2 = this.playersTeam2.filter(p => p.id !== player.id);
      this.playersTeam1.push(player);
    } else {
      this.playersTeam1 = this.playersTeam1.filter(p => p.id !== player.id);
      this.playersTeam2.push(player);
    }
  }

  dto: UpdateTeamsDto = new UpdateTeamsDto();
  team1: Team = new Team();
  team2: Team = new Team();

  saveGame() {
    console.log('Players team 1: ', this.playersTeam1);
    console.log('Players team 2: ', this.playersTeam2);

    this.team1.players = this.playersTeam1;
    this.team2.players = this.playersTeam2;

    this.dto.team1 = this.team1;
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
