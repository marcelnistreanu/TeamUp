import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/Game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseUrl = 'https://localhost:7017/api/Game';
  constructor(private http: HttpClient) { }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getGames`);
  }

  addGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}/addGame`, game);
  }
}
