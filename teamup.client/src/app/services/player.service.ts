import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/Player';
import { API_CONFIG } from '../api.config';
import { Result } from '../models/Result';
import { CreatePlayerDto, UpdatePlayerDto } from '../models/Dtos';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  baseUrl = API_CONFIG.baseUrl + '/Player';
  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Result<Player[]>> {
    return this.http.get<Result<Player[]>>(`${this.baseUrl}/getPlayers`);
  }

  addPlayer(playerDto: CreatePlayerDto): Observable<CreatePlayerDto> {
    return this.http.post<CreatePlayerDto>(`${this.baseUrl}/addPlayer`, playerDto);
  }

  updatePlayer(playerId: number, updatePlayerDto: UpdatePlayerDto): Observable<UpdatePlayerDto> {
    return this.http.put<UpdatePlayerDto>(`${this.baseUrl}/updatePlayer/${playerId}`, updatePlayerDto);
  }

  deletePlayer(playerId: number): Observable<Player> {
    return this.http.delete<Player>(`${this.baseUrl}/deletePlayer/${playerId}`);
  }
}
