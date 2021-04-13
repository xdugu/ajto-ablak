import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// This service will be used to store stuff, now primarily in the local storage
export class TokenStorageService {

  constructor() {}

  setNumber(id: string, value: number): void{
    localStorage.setItem(id, value.toString());
  }

  getNumber(id: string): number{
    const item = localStorage.getItem(id);

    if (item != null){
      return parseFloat(item);
    }

    return null;
  }

  // saves a string
  setString(id: string, value: string): void {
    localStorage.setItem(id, value);
  }

  // gets a string
  getString(id: string): string {
    return localStorage.getItem(id);
  }

  // saves an object
  setObj(id: string, value: object): void{
    localStorage.setItem(id, JSON.stringify(value));
  }

  // returns an object
  getObj(id: string): any{
    const item = localStorage.getItem(id);
    if (item !== null || item !== undefined){
      return JSON.parse(item);
    }
    else{
      return null;
    }
  }

  // removes an item from storage
  removeItem(id: string): void{
    localStorage.removeItem(id);
  }
}
