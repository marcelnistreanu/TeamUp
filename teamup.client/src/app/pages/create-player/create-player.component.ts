import { Component } from '@angular/core';
import { Player } from '../../models/Player';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.css'
})
export class CreatePlayerComponent {

  player: Player = new Player();

  onSubmit(): void {

  }
}
