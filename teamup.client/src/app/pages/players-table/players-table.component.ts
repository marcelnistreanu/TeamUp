import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/Player';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result } from '../../models/Result';


@Component({
  selector: 'app-players-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormField, MatLabel, MatInputModule, MatIconModule,
    MatButtonModule, EditPlayerComponent, MatDatepicker, MatNativeDateModule, CalendarModule],
  templateUrl: './players-table.component.html',
  styleUrl: './players-table.component.css'
})
export class PlayersTableComponent implements OnInit, OnDestroy {

  players: Player[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'nickName', 'age', 'rating', 'actions'];
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];


  constructor(private playerService: PlayerService, private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPlayers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getPlayers(): void {
    this.subscriptions.push(this.playerService.getPlayers().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.players = response.value;
          this.dataSource = new MatTableDataSource(this.players);
          this.dataSource.sort = this.sort;
          console.log("List", this.players);
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
    );
  }

  filter(e: any): void {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate;
  }

  editPlayer(player: Player): void {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: player,
      height: '400px',
      width: '600px',
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe(() => this.getPlayers()));
  }

  deletePlayer(player: Player): void {
    this.subscriptions.push(
      this.playerService.deletePlayer(player.id).subscribe({
      next: (response: any) => {
        console.log(response);

        // delete player from table (UI)
        const playerIndex = this.dataSource.data.findIndex((p) => p.id === player.id);
        if (playerIndex > -1) {
          const filteredData = this.dataSource.data.filter((p) => p.id !== player.id);
          this.dataSource.data = filteredData;
          this.snackBar.open('Player deleted!', '', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
    )
  }



}
