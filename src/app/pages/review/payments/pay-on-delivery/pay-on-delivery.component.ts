import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from '../../../../shared-module/components/dialog/dialog.component';
import { BasketService } from '@app/shared-services/basket.service';

@Component({
  selector: 'app-pay-on-delivery',
  templateUrl: './pay-on-delivery.component.html',
  styleUrls: ['./pay-on-delivery.component.scss']
})
export class PayOnDeliveryComponent implements OnInit {
  @Output() orderConfirmed = new EventEmitter();
  @Input() width = 300;
  @Input() lang = 'hu';
  @Input() comments: string = null;
  @Input() totalCost: string = null;
  @Input() extraCost: string = null;
  private messages: any = null;

  constructor(private dialog: MatDialog, private basketService: BasketService) { }

  ngOnInit(): void {
    this.messages = {
      title: {
        en: 'Bank Transfer',
        hu: 'Banki átutalás'
      },
      content: {
        en: `Please confirm that you want to pay on delivery of the item(s). Payment on delivery
            incurs an additional delivery cost of
            <span class="price">${this.extraCost}</span>to you.
            Your total cost will be ${this.totalCost}`,

        hu: `Kérjük erősítse meg, hogy utánvéttel szeretne fizetni.
            A megerősítéshez küldünk Önnek egy e-mailt. Kérjük vegye figyelembe, hogy utánvét esetén a végösszeghez hozzáadódik az utánvét díja, mely 
            <span class="price">${this.extraCost}</span>.
            Így a végösszeg <span class="price">${this.totalCost}</span>.`
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
    this.basketService.placeOrder('payOnDelivery', this.comments, null).then(() => {
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
