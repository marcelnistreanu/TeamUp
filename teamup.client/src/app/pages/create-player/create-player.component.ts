import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreatePlayerDto } from '../../models/Dtos';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatError, MatInputModule,
    ReactiveFormsModule,],
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.css'
})
export class CreatePlayerComponent implements OnInit, OnDestroy {

  playerDto: CreatePlayerDto = new CreatePlayerDto();
  formSubmitted: boolean = false;
  updateForm: FormGroup;
  isSuccessful: boolean = false;
  errorMessage: string = '';
  failure = false;
  subscription: Subscription;


  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nickName: [''],
      dob: [null]
    })
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  constructor(
    private playerService: PlayerService,
    private formBuilder: FormBuilder) { }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      this.playerDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        nickName: formValue.nickName,
        dob: formValue.dob
      };

      this.subscription = this.playerService.addPlayer(this.playerDto).subscribe({
        next: (response) => {
          console.log(response);
          this.isSuccessful = true;
          this.failure = false

          // prepare form for a new entry
          this.formSubmitted = false;
          this.updateForm.reset();
        },
        error: (error) => {
          this.failure = true;
          console.error(error);
          const fieldName = error.error.invalidField;
          const message = error.error.errorMessage;
          this.errorMessage = `${fieldName}: ${message}`;
        }
      })
    }
    
  }
}
