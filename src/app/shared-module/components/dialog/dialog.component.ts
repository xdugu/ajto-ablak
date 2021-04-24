import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// data interface for dialogs
export interface DialogInterface {
  title: string;
  content: string;
  buttons: Array<ButtonOptions>;
}

interface ButtonOptions{
   id: string;
   text: string;
   textColor: string;
}


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent{

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogInterface) { }

}
