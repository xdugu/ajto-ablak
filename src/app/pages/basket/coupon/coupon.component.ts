import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BasketService, BasketInterface } from '@app/shared-services/basket.service';
import { DialogComponent, DialogInterface} from '@app/shared-module/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService } from '@app/shared-services/language.service';

interface IDiscountInfo{
  code: string
}

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @Input() discountInfo: IDiscountInfo | null = null;
  @Output() couponChange = new EventEmitter<BasketInterface>();
  lang = 'hu'
  couponCode = '';
  messages = {
    en: "Coupon code is invalid",
    hu: "A kuponkód helytelen",
    de: "Coupon code is invalid"
  }

  constructor(
    private basketService: BasketService, 
    private dialog: MatDialog,
    private langService: LanguageService
  
    ) { }

  ngOnInit(): void {
    this.langService.getLang().then(lang => this.lang = lang)
  }

  onAddCoupon(){
    this.basketService.applyCoupon(this.couponCode).then((res) => this.couponChange.emit(res))
    .catch(() => {
      const dialogData: DialogInterface = {
        title: this.messages[this.lang],
        content: "",
        buttons: []
      };
      this.dialog.open(DialogComponent, {
        data: dialogData
      });
    })
  }

  onRemoveCoupon(){
    this.basketService.removeCoupon(this.discountInfo.code).then((res) => this.couponChange.emit(res))
  }

}
