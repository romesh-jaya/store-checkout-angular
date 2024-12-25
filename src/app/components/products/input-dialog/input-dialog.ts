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
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../../services/notification.service';

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
    MatInputModule,
  ],
})
export class InputDialog {
  constructor(
    public dialogRef: MatDialogRef<InputDialog>,
    private notificationService: NotificationService,
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

  onOkClicked() {
    if (
      isNaN(+this.data.qty) ||
      (this.data.discount && isNaN(+this.data.discount))
    ) {
      this.notificationService.error(
        'Please enter valid quantity and discount.'
      );
      return;
    } else if (
      this.data.discount &&
      (+this.data.discount > 100 || +this.data.discount < 0)
    ) {
      this.notificationService.error('Discount must be between 0 and 100.');
      return;
    }
    if (+this.data.qty <= 0) {
      this.notificationService.error('Quantity must be greater than 0.');
      return;
    }

    this.dialogRef.close(this.data);
  }
}
