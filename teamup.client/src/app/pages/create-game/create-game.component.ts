import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Game } from '../../models/Game';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { GameService } from '../../services/game.service';


@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatError, MatInputModule,
    ReactiveFormsModule, MatDatepicker, MatNativeDateModule, CalendarModule, TagModule],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.css'
})
export class CreateGameComponent implements OnInit{

  game: Game = new Game();
  formSubmitted: boolean = false;
  form: FormGroup;
  isSuccessful: boolean = false;
  errorMessage: string = '';
  failure = false;

  constructor(private formBuilder: FormBuilder,
    private gameService: GameService) { }
   
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: new FormControl('', Validators.required),
      location: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const formValue = this.form.value;
      this.game = {
        date: formValue.date,
        location: formValue.location
      }

      // http request to create game
      this.gameService.addGame(this.game).subscribe(
        (reponse: any) => {
          console.log(reponse);
          this.isSuccessful = true;
          this.failure = false

          // prepare form for a new entry
          this.formSubmitted = false;
          this.form.reset();
        },
        (error) => {
          this.failure = true;
          console.error(error);

          const fieldName = error.error.invalidField;
          const message = error.error.errorMessage;
          this.errorMessage = `${fieldName}: ${message}`;
        }
      )
    }
  }
}
