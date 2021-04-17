import { Injectable } from '@angular/core';
import { TokenStorageService } from '@app/shared-services/token-storage.service';

export interface CustomerDetailsInterface{
  firstName: string; lastName: string;
  address1: string; address2: string;
  city: string; countryCode?: string; postCode: string;
  number: string; email: string; lang?: string;
}

@Injectable({
  providedIn: 'root'
})
// Service to get and set customer details
export class CustomerDetailsService {

  constructor(private storageService: TokenStorageService) { }

  get(): Promise<CustomerDetailsInterface>{
    return new Promise(resolve => {
      const currentDetails = this.storageService.getObj('CustomerDetails');
      if (currentDetails == null){
        // create new default details
        const newDetails = {
          firstName: null, lastName: null, email: null,
          address1: null, address2: null,
          city: null, countryCode: null, postCode: null, number: null
        };

        resolve(newDetails);
      }
      else{
        resolve(currentDetails);
      }
    });
  }

  update(details: CustomerDetailsInterface): void{
    this.storageService.setObj('CustomerDetails', details);
  }
}
