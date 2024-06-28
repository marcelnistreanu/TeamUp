import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/Game';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AddPlayersToGameDto, UpdateGameDto } from '../../models/Dtos';
import { InputOtpModule } from 'primeng/inputotp';
import { Player } from '../../models/Player';
import { PlayerService } from '../../services/player.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Team } from 'app/models/Team';
import { DialogService } from 'primeng/dynamicdialog';
import { GenerateTeamsDialogComponent } from '../generate-teams-dialog/generate-teams-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    ReactiveFormsModule,
    DropdownModule,
    InputOtpModule,
    CheckboxModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './games-table.component.html',
  styleUrl: './games-table.component.css',
})
export class GamesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private gameService: GameService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private playerService: PlayerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  games: Game[] = [];
  message: string;

  subscriptions: Subscription[] = [];

  editDialog: boolean = false;
  editForm: FormGroup;

  statuses: any[];
  selectedGame: Game;

  gameDto: UpdateGameDto = new UpdateGameDto();
  formSubmitted: boolean = false;
  isSuccessful: boolean = false;

  selectedPlayers: Player[] = [];

  addPlayersDialog: boolean = false;
  players: Player[];
  allPlayers: Player[] = [];

  addPlayersToGameDto: AddPlayersToGameDto = new AddPlayersToGameDto(
    this.selectedPlayers
  );

  ngOnInit(): void {
    this.getGames();
    this.getPlayers();
    this.editForm = this.formBuilder.group({
      date: new FormControl('', Validators.required),
      location: ['', [Validators.required]],
      status: ['', [Validators.required]],
      scoreTeam1: ['', [Validators.required]],
      scoreTeam2: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    const message = localStorage.getItem('toastMessage');
    if (message) {
      const parsedMessage = JSON.parse(message);
      this.messageService.add(parsedMessage);
      localStorage.removeItem('toastMessage');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  revertGame(game: Game): void {
    this.gameService.revertGame(game.id).subscribe({
      next: (response) => {
        console.log(response);

        this.getGames();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getGames(): void {
    this.subscriptions.push(
      this.gameService.getGames().subscribe({
        next: (response) => {
          console.log(response);
          this.games = response.value;
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }

  deleteGame(game: Game): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected game?',
      accept: () => {
        this.subscriptions.push(
          this.gameService.deleteGame(game.id).subscribe({
            next: (response) => {
              console.log(response);
              this.games = this.games.filter((g) => g.id !== game.id);
              this.confirmationService.close();
              this.messageService.add({
                severity: 'success',
                summary: 'Success!',
                detail: response.message.message,
                life: 3000,
              });
            },
            error: (error) => {
              console.error(error);
              this.confirmationService.close();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'Failed to delete game.',
              });
            },
          })
        );
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  getTagSeverity(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Canceled':
        return 'danger';
      case 'Reverted':
        return 'warning';
      default:
        return 'info';
    }
  }

  // Hide edit dialog
  hideDialog(): void {
    this.editDialog = false;
    this.getGames();
    this.isSuccessful = false;
  }

  editGame(game: Game): void {
    this.editDialog = true;
    this.selectedGame = game;
    this.statuses = [
      { label: 'Scheduled', value: 'Scheduled' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Canceled', value: 'Canceled' },
      { label: 'Reverted', value: 'Reverted' },
    ];

    this.editForm.patchValue({
      date: game.date,
      location: game.location,
      status: game.status,
      scoreTeam1: game.scoreTeam1,
      scoreTeam2: game.scoreTeam2,
    });
    this.editForm.controls['date'].setValue(game.date);
  }

  updateGame(): void {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formValue = this.editForm.value;

      // Check if the scores have changed
      const scoresChanged =
        formValue.scoreTeam1 !== this.selectedGame.scoreTeam1 ||
        formValue.scoreTeam2 !== this.selectedGame.scoreTeam2;
      
      const statusChanged = formValue.status !== this.selectedGame.status;

      // If scores have changed and status is not 'Completed', set it to 'Completed'
      if (!statusChanged && scoresChanged && formValue.status !== 'Completed') {
        formValue.status = 'Completed';
      }

      this.gameDto = {
        date: formValue.date,
        location: formValue.location,
        status: formValue.status,
        scoreTeam1: formValue.scoreTeam1,
        scoreTeam2: formValue.scoreTeam2,
      };

      console.log(this.gameDto);

      this.subscriptions.push(
        this.gameService
          .updateGame(this.selectedGame.id, this.gameDto)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.message = response.message.message;
              this.isSuccessful = true;
            },
            error: (error) => {
              console.error(error);
            },
          })
      );
    }
  }

  getPlayers(): void {
    this.subscriptions.push(
      this.playerService.getPlayers().subscribe({
        next: (response) => {
          this.players = response.value.map((player) => ({
            ...player,
            selected: false,
          }));
          this.allPlayers = this.players;
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }

  addPlayers(game: Game): void {
    this.initializeSelectedPlayers(game);
    this.addPlayersDialog = true;
    this.selectedGame = game;
  }

  hideAddPlayersDialog(message?: {
    severity: string;
    summary: string;
    detail: string;
  }): void {
    this.addPlayersDialog = false;
    this.getGames();
    this.players = [...this.allPlayers];

    if (message) {
      setTimeout(() => {
        this.messageService.add({
          key: 'selectPlayers',
          severity: message.severity,
          summary: message.summary,
          detail: message.detail,
          life: 3000,
        });
      }, 50);
    }
  }

  initializeSelectedPlayers(selectedGame: Game): void {
    this.selectedPlayers = [];

    // Iterate over the players of the selected game
    selectedGame.players.forEach((player) => {
      // Find the corresponding player from the players array
      const matchingPlayer = this.players.find((p) => p.id === player.id);

      // If the player is found, add it to the selectedPlayers array
      if (matchingPlayer) {
        this.selectedPlayers.push(matchingPlayer);
      }
    });
  }

  // Select players for game
  save(): void {
    this.addPlayersToGameDto.players = this.selectedPlayers;

    this.subscriptions.push(
      this.gameService
        .addPlayersToGame(this.selectedGame.id, this.addPlayersToGameDto)
        .subscribe({
          next: (response) => {
            console.log(response);

            let message;
            if (
              response.message.message !==
              "No changes were made to the game's players."
            ) {
              message = {
                severity: 'success',
                summary: 'Success!',
                detail: response.message.message,
              };
              this.resetTeams(this.selectedGame.id);
            } else {
              message = {
                severity: 'info',
                summary: 'Info',
                detail: response.message.message,
              };
            }

            // Hide the dialog and show the message
            this.hideAddPlayersDialog(message);
          },
          error: (error) => {
            console.error(error);
          },
        })
    );
  }

  resetTeams(gameId: number): void {
    this.gameService.resetTeams(gameId).subscribe({
      next: (response) => {
        console.log('Reset teams: ', response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ovr: number;

  calculateRating(team: Team): number {
    this.ovr = 0;
    if (team?.players) {
      team.players?.forEach((player) => {
        if (player.rating !== undefined) {
          this.ovr = this.ovr + player.rating;
        }
      });
    }
    return this.ovr;
  }

  generateTeamsDialog: boolean = false;

  openGenerateTeamsDialog(game: Game) {
    this.router.navigate(['/generate-teams', game.id]);
    // this.generateTeamsDialog = true;
    // const ref = this.dialog.open(GenerateTeamsDialogComponent, {
    //   data: game,
    //   height: '600px',
    //   width: '600px',
    // });

    // this.subscriptions.push(ref.afterClosed().subscribe(() =>
    //   setTimeout(() => {
    //     this.getGames()
    //   }, 100)
    //   ));
  }

  filterPlayers(event: Event) {
    const input = event?.target as HTMLInputElement;
    const query = input.value.toLowerCase();

    if (query.trim() === '') {
      this.players = [...this.allPlayers];
    } else {
      this.players = this.allPlayers.filter((player) =>
        (player.firstName + ' ' + player.lastName).toLowerCase().includes(query)
      );
    }
  }

  @ViewChild('dt1') dt1: Table;

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.players.length === 1 && this.dt1) {
      const selectedPlayer = this.players[0];

      // Check if the player is already in the selectedPlayers array
      if (!this.selectedPlayers.includes(selectedPlayer)) {
        this.selectedPlayers.push(selectedPlayer);
      }

      this.dt1.selection = this.selectedPlayers;
      console.log(this.selectedPlayers);
      this.cdr.detectChanges();
    }
  }

  clearSearch(event: MouseEvent) {
    const input = (event.target as HTMLElement)
      .previousElementSibling as HTMLInputElement;
    if (input) {
      input.value = '';
      this.filterPlayers({ target: input } as unknown as Event);
    }
  }
}
