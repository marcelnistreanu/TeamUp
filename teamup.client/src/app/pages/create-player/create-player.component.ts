import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../../models/Player';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatError, MatInputModule,
    ReactiveFormsModule,],
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.css'
})
export class CreatePlayerComponent implements OnInit {

  player: Player = new Player();
  formSubmitted: boolean = false;
  updateForm: FormGroup;
  isSuccessful: boolean = false;
  errorMessage: string = '';


  ngOnInit(): void {
    console.log(this.player);
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nickName: [''],
      age: ['']
    })
  }

  constructor(
    private playerService: PlayerService,
    private formBuilder: FormBuilder) { }

  onSubmit(): void {
    this.formSubmitted = true;
    console.log('Form submitted:', this.formSubmitted);
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      this.player = {
        id: 0,
        name: formValue.name,
        email: formValue.email,
        nickName: formValue.nickName,
        age: formValue.age
      };

      console.log(this.player);

      this.playerService.addPlayer(this.player).subscribe(
        (response: any) => {
            console.log(response);
          this.isSuccessful = true;

          // prepare form for a new entry
          this.formSubmitted = false;
          this.updateForm.reset();
        },
        (error) => {
          console.error(error);
          this.errorMessage = error.message;
          console.log(this.errorMessage);
        }
      )
    } else {
      console.log('Form is invalid, cannot submit.');
    }
    
  }
}
