import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from '../../../../shared-module/components/dialog/dialog.component';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.scss']
})
export class BankTransferComponent implements OnInit {
  @Output() orderConfirmed = new EventEmitter();
  @Input() width = 300;
  @Input() lang = 'en';

  private messages = {
    title: {
      en: 'Bank Transfer',
      hu: 'Banki átutalás'
    },
    content: {
      en: `Please confirm that you want to pay by bank transfer. We will send an email
      to confirm our bank details. On receipt of the payment, your ordered items
      will be shipped to you`,

      hu: `Kérjük erősítsd meg, hogy valóban banki átutalással szeretnél fizetni.
            Amennyiben igen,email-en elküldjük neked az utaláshoz szükséges adatokat.`
    },
    buttons: {
      confirm: {
        en: 'Confirm',
        hu: 'Megerősítés'
      }
    }
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  triggerPaymentFlow(): void{

    const dialogConfirm = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: this.messages.title[this.lang],
        content: this.messages.content[this.lang],
        buttons: [
          {
            id: 'Confirm',
            text: this.messages.buttons.confirm[this.lang],
            textColor: 'green',
          }
        ]
      }
    });

    dialogConfirm.afterClosed().subscribe({
      next: result => {
        if (result !== null && result.id === 'Confirm'){
          this.onPaymentTypeAccepted();
        }
      }
    });
  }

  onPaymentTypeAccepted = () => {
    this.orderConfirmed.emit(null);
  }

}
