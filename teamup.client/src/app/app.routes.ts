import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreatePlayerComponent } from './pages/create-player/create-player.component';
import { EditPlayerComponent } from './pages/edit-player/edit-player.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { GamesTableComponent } from './pages/games-table/games-table.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-player', component: CreatePlayerComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'games', component: GamesTableComponent },
  { path: '', component: HomeComponent }
];
