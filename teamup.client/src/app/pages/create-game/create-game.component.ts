import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { CreateGameDto } from '../../models/Dtos';


@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatError, MatInputModule,
    ReactiveFormsModule, MatDatepicker, MatNativeDateModule, CalendarModule, TagModule],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.css'
})
export class CreateGameComponent implements OnInit, OnDestroy {

  gameDto: CreateGameDto = new CreateGameDto();
  formSubmitted: boolean = false;
  form: FormGroup;
  isSuccessful: boolean = false;
  errorMessage: string = '';
  failure = false;
  message: string;

  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
    private gameService: GameService) { }
   
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: new FormControl('', Validators.required),
      location: ['', [Validators.required]]
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const formValue = this.form.value;
      this.gameDto = {
        date: formValue.date,
        location: formValue.location
      }

      this.gameDto.date.setTime(this.gameDto.date.getTime() + (3 * 60 * 60 * 1000)); // Add 3 hours for EEST
      console.log("GameDto before http: ", this.gameDto);

      // http request to create game
      this.subscriptions.push(this.gameService.addGame(this.gameDto).subscribe({
        next: (response) => {
          console.log(response);
          this.message = response.message.message;
          console.log(this.message);
          this.isSuccessful = true;
          this.failure = false

          // prepare form for a new entry
          this.formSubmitted = false;
          this.form.reset();
        },
        error: (error) => {
          this.failure = true;
          console.error(error);

          const fieldName = error.error.invalidField;
          const message = error.error.errorMessage;
          this.errorMessage = `${fieldName}: ${message}`;
        }
      })
    )}
  }
}
