import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.html',
  styleUrls: ['./input-dialog.css'],
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
  ],
})
export class InputDialog {
  constructor(
    public dialogRef: MatDialogRef<InputDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      qty: string;
      discount: string;
      price: number[];
      selectedPrice: number;
    }
  ) {
    data.selectedPrice = data.price[0];
  }
}
