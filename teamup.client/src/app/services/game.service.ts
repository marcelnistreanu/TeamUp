import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/Game';
import { API_CONFIG } from '../api.config';
import { AddPlayersToGameDto, CreateGameDto, UpdateGameDto, UpdateTeamsDto } from '../models/Dtos';
import { Result } from '../models/Result';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseUrl = API_CONFIG.baseUrl + '/Game';

  constructor(private http: HttpClient) { }

  getGames(): Observable<Result<Game[]>> {
    return this.http.get<Result<Game[]>>(`${this.baseUrl}/getGames`);
  }

  addGame(gameDto: CreateGameDto): Observable<Result<Game>> {
    return this.http.post<Result<Game>>(`${this.baseUrl}/addGame`, gameDto);
  }

  updateGame(gameId: number, game: UpdateGameDto): Observable<Result<Game>> {
    return this.http.put<Result<Game>>(`${this.baseUrl}/updateGame/${gameId}`, game);
  }

  deleteGame(gameId: number): Observable<Result<Game>> {
    return this.http.delete<Result<Game>>(`${this.baseUrl}/deleteGame/${gameId}`);
  }

  addPlayersToGame(gameId: number, game: AddPlayersToGameDto): Observable<Result<Game>> {
    return this.http.put<Result<Game>>(`${this.baseUrl}/addPlayersToGame/${gameId}`, game);
  }

  generateTeams(gameId: number): Observable<Result<Game>> {
    return this.http.put<Result<Game>>(`${this.baseUrl}/generateTeams/${gameId}`, null);
  }

  updateGameTeams(gameId: number, gameDto: UpdateTeamsDto): Observable<Result<Game>> {
    return this.http.put<Result<Game>>(`${this.baseUrl}/updateGameTeams/${gameId}`, gameDto);
  }

  getGameDetails(id: number): Observable<Result<Game>> {
    return this.http.get<Result<Game>>(`${this.baseUrl}/getGameDetails/${id}`);
  }

  resetTeams(id: number): Observable<Result<Game>> {
    return this.http.delete<Result<Game>>(`${this.baseUrl}/resetGameTeams/${id}`);
  }

  getGameById(id: number): Observable<Result<Game>> {
    return this.http.get<Result<Game>>(`${this.baseUrl}/getGame/${id}`);
  }

  revertGame(id: number): Observable<Result<Game>> {
    return this.http.put<Result<Game>>(`${this.baseUrl}/revertGame/${id}`, null);
  }
  
}
