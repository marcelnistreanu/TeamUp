import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormField, MatLabel, MatInputModule, MatIconModule,
    MatButtonModule,],
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

    // receive updated player data
    dialogRef.componentInstance.playerUpdated.subscribe((updatedPlayer: Player) => {
      console.log("Updated player:", updatedPlayer)

      // update the players array with the updated player via a new list
      const updatedPlayers = this.players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
      this.players = updatedPlayers;

      // trigger change detection to update UI
      this.cdRef.detectChanges();

      // find updated player's index in datasource
      const dataSourceIndex = this.dataSource.data.findIndex(p => p.id === updatedPlayer.id);
      if (dataSourceIndex > -1) {

        // replace player data in the data source
        this.dataSource.data[dataSourceIndex] = updatedPlayer;
        console.log(this.dataSource.data);
        this.cdRef.detectChanges();

      }
    });

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
