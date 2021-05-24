import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorageService } from '@app/shared-services/token-storage.service';
import { CustomerDetailsService, CustomerDetailsInterface } from '@app/shared-services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '@app/shared-services/preferences.service';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';
import { ConfigService } from '@app/shared-services/config.service';
import { HttpParams } from '@angular/common/http';

export interface BasketInterface{
  BasketId: string;
  StoreId: string;
  Items: [];
  Count: number;
  Costs: object;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketCount = new BehaviorSubject(0); // emits events on basket count and update to basket
  private basket = null; // stores actual basket
  private basketId = null; // stores the basket id
  private loadingBasket = false; // flag to note when basket is loading to prevent multiple simultaneous network requests

  constructor(private tokenService: TokenStorageService, private apiService: ApiManagerService,
              private configService: ConfigService, private customerDetailsService: CustomerDetailsService,
              private prefService: PreferencesService) {
    this.basketId = tokenService.getString('BasketId');
  }

  // gets the basket
  getBasket(): Observable<BasketInterface> {
    return new Observable((observer) => {
      if (this.basket){
        observer.next(this.basket);
        return;
      }

      if (this.basketId === null){
        observer.next(null);
        return;
      }

      if (this.basket === null){
        if (!this.loadingBasket){
          this.loadingBasket = true;
          this._getBasket();
          const interval = setInterval(() => {
            if (!this.loadingBasket){
              observer.next(this.basket);
              clearInterval(interval);
              return;
            }
          }, 500);
        } // if
      } // if
    });

  }

  getBasketCount(): BehaviorSubject<number>{
    if (this.basket == null && !this.loadingBasket && this.basketId != null){
      this._getBasket();
    }
    return this.basketCount;
  }

  // adds an item to basket
  addToBasket(itemId: string, combination: any): Observable<BasketInterface>{
    return new Observable(observer => {

      this.configService.getConfig('storeId').subscribe({
        next: (storeId) => {
          this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket', new HttpParams(), {
                itemId,
                basketId: this.basketId,
                storeId,
                combination
            }).subscribe({
                next: (basket: BasketInterface) => {
                        this.basketId = basket.BasketId;
                        this.tokenService.setString('BasketId', this.basketId);
                        this.basket = basket;
                        this.basketCount.next(this.basket.Count);
                        observer.next();
                      },
                error: (err) => observer.error(err)
            });
        }
      });
    });

  }

  // changes the quantity of an item in basket
  changeQuantity(index: number, newQuantity: number): Promise<BasketInterface>{
    return new Promise ((resolve, reject) => {
        this.configService.getConfig('storeId').subscribe(storeId => {
          this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/quantity', new HttpParams(), {
            basketId: this.basketId,
            storeId,
            index,
            newQuantity,
         }).subscribe({
           next: basket => {
            this.basket = basket;
            resolve(this.basket);
          },
          error: err => reject(err)
        });
        });
    });
  }

  removeItem(index: number): Promise<BasketInterface>{
    return new Promise ((resolve, reject) => {
      this.configService.getConfig('storeId').subscribe(storeId => {
          this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/remove', new HttpParams(), {
            basketId: this.basketId,
            storeId,
            index,
         }).subscribe(basket => {
            this.basket = basket;
            resolve(this.basket);
         },
         err => {
           reject(err);
         });
        });
    });
  }

  // actually performs network request to get basket
  private _getBasket(): void{
      this.configService.getConfig('storeId').subscribe({
        next: (storeId) => {
          this.apiService.post(API_MODE.OPEN, API_METHOD.GET, 'basket', new HttpParams(), {
            basketId: this.basketId,
            storeId,
          }).subscribe({
            next: (basket: BasketInterface) => {
              this.basket = basket;
              this.tokenService.setString('BasketId', this.basket.BasketId);
              this.basketCount.next(this.basket.Count);
              this.loadingBasket = false;
            },
            error: () => this.loadingBasket = false
          });
        },
        error: () => this.loadingBasket = false
      });
  }

  placeOrder(paymentType: string, comments: string, paymentDetails: any): Promise<any>{
    return new Promise((resolve, reject) => {
      this.prefService.getPreferences().subscribe({
        next: preferences => {
          this.customerDetailsService.get().then(customer => {
            const lang = preferences.lang.chosen;
            customer.countryCode = preferences.countryCode;
            customer.lang = lang;

            this.apiService.post(API_MODE.OPEN, API_METHOD.UPDATE, 'basket/order', new HttpParams(), {
              orderDetails: {
                contact: customer,
                currency: preferences.currency.chosen,
                paymentMethod: paymentType === 'payOnDelivery' ? 'payOnDelivery' : 'payBeforeDelivery',
                paymentType,
                deliveryMethod: preferences.deliveryMethod,
                comments: comments.length === 0 ? null : comments,
                paymentDetails
            },
            basketId: this.basket.BasketId,
            storeId:  this.basket.StoreId
            }).subscribe({
              next: (data) => {
                this.clearBasket();
                resolve(data);
                return;
              },
              error: err => reject(err)
            });
          });
        },
        error: err => reject(err)
      });
    });
  }

  clearBasket(): void {
    this.tokenService.removeItem('BasketId');
    this.basket = null;
    this.basketId = null;
    this.basketCount.next(0);
    this.prefService.clearPreferences();
  }

}
