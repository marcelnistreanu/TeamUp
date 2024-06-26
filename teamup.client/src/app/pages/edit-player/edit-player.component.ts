import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Player } from '../../models/Player';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { UpdatePlayerDto } from '../../models/Dtos';


@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [FormsModule, MatIconModule, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInputModule, CommonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.css'
})
export class EditPlayerComponent implements OnInit, OnDestroy {

  updateForm: FormGroup;
  formSubmitted: boolean = false;
  playerDto: UpdatePlayerDto = new UpdatePlayerDto();
  isSuccessful: boolean = false;
  failure: boolean = false;
  errorMessage: string = '';

  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<EditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player) { }

  ngOnInit(): void {

    // complete form fields with selected player's data
    this.updateForm = this.formBuilder.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      nickName: [this.data.nickName],
      dob: [this.data.dob],
      rating: [this.data.rating, [Validators.required]]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.updateForm.valid) {

      // extract form data into player object
      const formValue = this.updateForm.value;
      this.playerDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        nickName: formValue.nickName,
        dob: formValue.dob,
        rating: formValue.rating
      }


      this.subscription = this.playerService.updatePlayer(this.data.id, this.playerDto).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isSuccessful = true;
          this.failure = false;
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

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
