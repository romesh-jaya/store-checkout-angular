import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.html',
  styleUrls: ['./error-dialog.css'],
  standalone: true,
  imports: [MatDialogActions, MatDialogContent],
})
export class ErrorDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
