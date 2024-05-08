import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/Game';
import { TableModule } from 'primeng/table';
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
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AddPlayersToGameDto, UpdateGameDto } from '../../models/Dtos';
import { InputOtpModule } from 'primeng/inputotp';
import { Player } from '../../models/Player';
import { PlayerService } from '../../services/player.service';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-games-table',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, RippleModule, ConfirmDialogModule, ToastModule,
    TagModule, DialogModule, InputTextModule, CalendarModule, ReactiveFormsModule, DropdownModule,
    InputOtpModule, CheckboxModule, FormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './games-table.component.html',
  styleUrl: './games-table.component.css'
})
export class GamesTableComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private playerService: PlayerService
  ) { }

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

  addPlayersToGameDto: AddPlayersToGameDto = new AddPlayersToGameDto(this.selectedPlayers);



  ngOnInit(): void {
    this.getGames();
    this.getPlayers();
    this.editForm = this.formBuilder.group({
      date: new FormControl('', Validators.required),
      location: ['', [Validators.required]],
      status: ['', [Validators.required]],
      scoreTeam1: ['', [Validators.required]],
      scoreTeam2: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getGames(): void {
    this.subscriptions.push(this.gameService.getGames().subscribe({
      next: (response) => {
        console.log(response);
        this.games = response.value;
      },
      error: (error) => {
        console.error(error);
      }
    })
    )
  }

  deleteGame(game: Game): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected game?',
      accept: () => {
        this.subscriptions.push(this.gameService.deleteGame(game.id).subscribe({
          next: (response) => {
            console.log(response);
            this.games = this.games.filter(g => g.id !== game.id);
            this.confirmationService.close();
            this.messageService.add({ severity: 'success', summary: 'Success!', detail: response.message.message, life: 3000 });
          },
          error: (error) => {
            console.error(error);
            this.confirmationService.close();
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Failed to delete game.' });
          }
        })
        )
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  getTagSeverity(status: string): string {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Canceled': return 'danger';
      default: return 'info';
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
      { label: "Scheduled", value: "Scheduled" },
      { label: "Completed", value: "Completed" },
      { label: "Canceled", value: "Canceled" },
    ];

    this.editForm.patchValue({
      date: game.date,
      location: game.location,
      status: game.status,
      scoreTeam1: game.scoreTeam1,
      scoreTeam2: game.scoreTeam2
    });
    this.editForm.controls['date'].setValue(game.date);

  }




  updateGame(): void {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      this.gameDto = {
        date: formValue.date,
        location: formValue.location,
        status: formValue.status,
        scoreTeam1: formValue.scoreTeam1,
        scoreTeam2: formValue.scoreTeam2
      }

      console.log(this.gameDto);

      this.subscriptions.push(this.gameService.updateGame(this.selectedGame.id, this.gameDto).subscribe({
        next: (response) => {
          console.log(response);
          this.message = response.message.message;
          this.isSuccessful = true;
        },
        error: (error) => {
          console.error(error);
        }
      })

      )
    }


  }



  getPlayers(): void {
    this.subscriptions.push(this.playerService.getPlayers().subscribe({
      next: (response) => {
        console.log(response);
        this.players = response.value.map(player => ({
          ...player,
          selected: false
        }));
        console.log(this.players);
      },
      error: (error) => {
        console.error(error);
      }
    }));
  }

  addPlayers(game: Game): void {
    this.initializeSelectedPlayers(game);
    this.addPlayersDialog = true;
    this.selectedGame = game;
  }

  hideAddPlayersDialog(): void {
    this.addPlayersDialog = false;
    this.getGames();
  }

  initializeSelectedPlayers(selectedGame: Game): void {
    this.selectedPlayers = [];

    // Iterate over the players of the selected game
    selectedGame.players.forEach(player => {
      // Find the corresponding player from the players array
      const matchingPlayer = this.players.find(p => p.id === player.id);
      
      // If the player is found, add it to the selectedPlayers array
      if (matchingPlayer) {
        this.selectedPlayers.push(matchingPlayer);
      }
    });
  }

  // Select players for game
  selectPlayers(): void {
    console.log("Players: ", this.selectedPlayers);
    console.log("Game: ", this.selectedGame);

    this.addPlayersToGameDto.players = this.selectedPlayers;

    this.gameService.addPlayersToGame(this.selectedGame.id, this.addPlayersToGameDto).subscribe({
      next: (response) => {
        console.log(response);
        this.messageService.add({key: 'selectPlayers', severity: 'success', summary: 'Success!', detail: response.message.message, life: 3000 });
      },
      error: (error) =>{
        console.error(error);
      }
    })
  }
}
