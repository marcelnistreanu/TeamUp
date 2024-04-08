import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Player } from '../../models/Player';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { PlayerService } from '../../services/player.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [FormsModule, MatIconModule, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInputModule, CommonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.css'
})
export class EditPlayerComponent implements OnInit {

  updateForm: FormGroup;
  formSubmitted: boolean = false;
  player: Player = new Player();
  isSuccessful: boolean = false;
  @Output() playerUpdated = new EventEmitter<Player>();

  constructor(
    private formBuilder: FormBuilder,
    private playerService: PlayerService,
    public dialogRef: MatDialogRef<EditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player) { }

  ngOnInit(): void {

    // complete form fields with selected player's data
    this.updateForm = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      nickName: [this.data.nickName],
      age: [this.data.age]
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
      this.player = {
        id: this.data.id,
        name: formValue.name,
        email: formValue.email,
        nickName: formValue.nickName,
        age: formValue.age
      }

      
      this.playerService.updatePlayer(this.player.id, this.player).subscribe(
        (response: any) => {
          console.log(response);
          this.isSuccessful = true;

          // emit updated player data to home component
          this.playerUpdated.emit(this.player);
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }



}
