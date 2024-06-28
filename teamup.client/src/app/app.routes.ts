import { Routes } from '@angular/router';
import { PlayersTableComponent } from './pages/players-table/players-table.component';
import { CreatePlayerComponent } from './pages/create-player/create-player.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { GamesTableComponent } from './pages/games-table/games-table.component';
import { GenerateTeamsComponent } from './pages/generate-teams/generate-teams.component';

export const routes: Routes = [
  { path: 'players', component: PlayersTableComponent },
  { path: 'create-player', component: CreatePlayerComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'games', component: GamesTableComponent },
  { path: 'generate-teams/:gameId', component: GenerateTeamsComponent },
  { path: '', component: PlayersTableComponent }
];
