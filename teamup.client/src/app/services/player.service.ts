import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  baseUrl = 'https://localhost:7017/api/Player';
  constructor(private http: HttpClient) { }

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getPlayers`);
  }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(`${this.baseUrl}/addPlayer`, player);
  }

  updatePlayer(playerId: number, updatedPlayer: Player): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updatePlayer/${playerId}`, updatedPlayer);
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePlayer/${playerId}`);
  }
}
