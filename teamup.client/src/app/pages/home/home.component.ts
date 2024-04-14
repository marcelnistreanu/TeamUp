import { ChangeDetectorRef, Component, OnInit, ViewChild, signal } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/Player';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormField, MatLabel, MatInputModule, MatIconModule,
    MatButtonModule, EditPlayerComponent, MatDatepicker, MatNativeDateModule, CalendarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  players: Player[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'nickName', 'age', 'rating', 'actions'];
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private playerService: PlayerService, private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers(): void {
    this.playerService.getPlayers().subscribe(
      (response: any) => {
        if (response) {
          console.log(response);
          this.players = response.value;
          this.dataSource = new MatTableDataSource(this.players);
          this.dataSource.sort = this.sort;
          console.log("List", this.players);
        }
      },
      (error) => {
        console.error(error);
      }
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

    dialogRef.afterClosed().subscribe(() => this.getPlayers());
  }

  deletePlayer(player: Player): void {
    this.playerService.deletePlayer(player.id).subscribe(
      (response: any) => {
        console.log(response);

        // delete player from table (UI)
        const playerIndex = this.dataSource.data.findIndex((p) => p.id === player.id);
        if (playerIndex > -1) {
          const filteredData = this.dataSource.data.filter((p) => p.id !== player.id);
          this.dataSource.data = filteredData;
          this.snackBar.open('Player deleted!', '', { duration: 2000 });
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }



}
