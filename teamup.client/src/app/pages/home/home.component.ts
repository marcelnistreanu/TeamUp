import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/Player';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  players: Player[] = [];
  displayedColumns: string[] = ['id', 'name', 'nickname', 'age', 'rating', 'preferred game'];
  dataSource: MatTableDataSource<Player>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private playerService: PlayerService) { }

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

  filterByName(e: any): void {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Player, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  filterByNickname(event: any): void {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Player, filter: string) => {
      if (data && data.nickname) {
        return data.nickname.toLowerCase().includes(filter);
      }
      return false;
    };
  }

  filterByGame(e: any): void {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Player, filter: string) => {
      return data.preferredGame.toLowerCase().includes(filter);
    };
  }



}
