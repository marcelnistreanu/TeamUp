import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UpdateTeamsDto } from 'app/models/Dtos';
import { Game } from 'app/models/Game';
import { Player } from 'app/models/Player';
import { Team } from 'app/models/Team';
import { GameService } from 'app/services/game.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { generate } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-generate-teams',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    MatIcon,
    TableModule,
    InputTextModule,
    MenuModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './generate-teams.component.html',
  styleUrl: './generate-teams.component.css',
})
export class GenerateTeamsComponent implements OnInit {
  gameId: number;
  game: Game;

  playersTeam1: Player[] = [];
  playersTeam2: Player[] = [];
  selectedPlayers: Player[] = [];
  availablePlayersInAddGroupsDialog: Player[] = [];

  temporarilySavedPlayersTeam1: Player[] = [];
  temporarilySavedPlayersTeam2: Player[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = +params['gameId'];
    });

    this.gameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        console.log(response);
        this.game = response.value;

        if (this.game.team1) this.playersTeam1 = this.game.team1.players;
        if (this.game.team2) this.playersTeam2 = this.game.team2.players;

        this.availablePlayersInAddGroupsDialog = [...this.game.players];

        // if there are no teams for game, generate teams when page opened
        if(!this.game.team1 && !this.game.team2) {
          this.generateTeams();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
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

  colorClasses: string[] = [
    'group-1',
    'group-2',
    'group-3',
    'group-4',
    'group-5',
  ];

  addPlayersToGroup(): void {
    if (this.selectedPlayers.length > 0) {
      this.playersGroups.push([...this.selectedPlayers]);
      this.removeSelectedPlayersFromAvailable();
      this.selectedPlayers = [];
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

    // Track which players are already assigned to a team
    let assignedPlayers = new Set<number>();
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
              groupPlayer.isGrouped = true;
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
              groupPlayer.isGrouped = true;
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
  }

  temporarilySavedTeams: any[] = [];

  calculateTeamRating(temporarilySavedTeam: Player[]): number {
    let ovr = 0;
    temporarilySavedTeam.forEach(player =>{
      ovr += player.rating;
    })
    return ovr;
  }

  saveCurrentTeamsTemporarily() {
    this.temporarilySavedPlayersTeam1 = [...this.playersTeam1];
    this.temporarilySavedPlayersTeam2 = [...this.playersTeam2];
    const message = {
      severity: 'success',
      summary: 'Success',
      detail: 'Teams have been saved',
      life: 3000,
    };

    const savedTeam = {
      team1: this.temporarilySavedPlayersTeam1,
      team2: this.temporarilySavedPlayersTeam2,
      team1Ovr: this.calculateTeamRating(this.temporarilySavedPlayersTeam1),
      team2Ovr: this.calculateTeamRating(this.temporarilySavedPlayersTeam2)
    }

    this.temporarilySavedTeams.push(savedTeam);
    this.messageService.add(message);
  }

  restoreSavedTeams() {
    if (this.temporarilySavedPlayersTeam1.length == 0 && this.temporarilySavedPlayersTeam2.length == 0) {
      const message = {
        severity: 'error',
        summary: 'Error',
        detail: 'No saved teams to restore',
        life: 3000,
      };

      this.messageService.add(message);
      return;
    }
    this.playersTeam1 = [...this.temporarilySavedPlayersTeam1];
    this.playersTeam2 = [...this.temporarilySavedPlayersTeam2];

    const message = {
      severity: 'success',
      summary: 'Success',
      detail: 'Teams have been restored',
      life: 3000,
    };

    this.messageService.add(message);
  }

  restoreSavedOption(savedTeam: any): void {
    this.playersTeam1 = [...savedTeam.team1];
    this.playersTeam2 = [...savedTeam.team2];

    const message = {
      severity: 'success',
      summary: 'Success',
      detail: 'Teams have been restored',
      life: 3000,
    };
    this.messageService.add(message);
  }

  selectedPlayer: Player | null = null;

  // Function to move player between teams
  movePlayer(player: Player, targetTeam: 'team1' | 'team2'): void {
    if (targetTeam === 'team1') {
      this.playersTeam2 = this.playersTeam2.filter((p) => p.id !== player.id);
      this.playersTeam1.push(player);
    } else {
      this.playersTeam1 = this.playersTeam1.filter((p) => p.id !== player.id);
      this.playersTeam2.push(player);
    }
  }

  dto: UpdateTeamsDto = new UpdateTeamsDto();
  team1: Team = new Team();
  team2: Team = new Team();

  saveGame() {
    this.team1.players = this.playersTeam1;
    this.team2.players = this.playersTeam2;

    this.dto.team1 = this.team1;
    this.dto.team2 = this.team2;

    this.gameService.updateGameTeams(this.game.id, this.dto).subscribe({
      next: (response) => {
        console.log(response);
        const message = {
          severity: 'success',
          summary: 'Success',
          detail: 'Teams updated successfully',
          key: 'savedTeams',
          life: 3000,
        };

        localStorage.setItem('toastMessage', JSON.stringify(message));
        this.location.back();
      },
      error: (error) => {
        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update teams',
        });
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

  filterPlayers(event: Event) {
    const input = event?.target as HTMLInputElement;
    const query = input.value.toLowerCase();

    if (query.trim() === '') {
      this.availablePlayersInAddGroupsDialog = [
        ...this.availablePlayersInAddGroupsDialog,
      ];
    } else {
      this.availablePlayersInAddGroupsDialog =
        this.availablePlayersInAddGroupsDialog.filter((player) =>
          (player.firstName + ' ' + player.lastName)
            .toLowerCase()
            .includes(query)
        );
    }
  }

  @ViewChild('dt1') dt1: Table;

  onSearchKeyPress(event: KeyboardEvent) {
    if (
      event.key === 'Enter' &&
      this.availablePlayersInAddGroupsDialog.length === 1 &&
      this.dt1
    ) {
      const selectedPlayer = this.availablePlayersInAddGroupsDialog[0];

      // Check if the player is already in the selectedPlayers array
      if (!this.selectedPlayers.includes(selectedPlayer)) {
        this.selectedPlayers.push(selectedPlayer);
      }

      this.dt1.selection = this.selectedPlayers;
      console.log(this.selectedPlayers);
      this.cdr.detectChanges();
    }
  }
}
