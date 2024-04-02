import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreatePlayerComponent } from './pages/create-player/create-player.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-player', component: CreatePlayerComponent },
  { path: '', component: HomeComponent }
];
