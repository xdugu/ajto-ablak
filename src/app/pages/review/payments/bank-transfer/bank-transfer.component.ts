import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from '../../../../shared-module/components/dialog/dialog.component';
import { BasketService } from '@app/shared-services/basket.service';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.scss']
})
export class BankTransferComponent implements OnInit {
  @Output() orderConfirmed = new EventEmitter();
  @Input() width = 300;
  @Input() lang = null;
  @Input() comments: string = null;

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
    paymentSuccessful: {
      title: {
        en: 'Order Successful',
        hu: 'Rendelés megerősítése'
      },
      content: {
        en: `We have sent you an email with our account details. We will ship you item
            as soon as the stated amount is credited to our account. Thank you for shopping
            with us`,
        hu: `Sikeresen elküldtük a banki utaláshoz szükséges adatokat az email címedre
            Kérjük, hogy saját érdekedben az utalást minél előbb tedd meg,
            hogy mi is minél hamarabb előkészíthessük és kézbesíthessük számodra a megrendelt terméket/termékeket.`
      }
    },
    buttons: {
      confirm: {
        en: 'Confirm',
        hu: 'Megerősítés'
      }
    }
  };

  constructor(private dialog: MatDialog, private basketService: BasketService) { }

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

  // called when customer accepts payment type
  onPaymentTypeAccepted = () => {
    this.basketService.placeOrder('bankTransfer', this.comments, null).then(() => {
      this.dialog.open(DialogComponent, {
        width: '400px',
        data: {
          title: this.messages.paymentSuccessful.title[this.lang],
          content: this.messages.paymentSuccessful.content[this.lang]
        }
      }).afterClosed().subscribe({
        next: () => this.orderConfirmed.emit(null)
      });
    });
  }

}
