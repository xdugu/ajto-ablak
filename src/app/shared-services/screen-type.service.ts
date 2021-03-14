import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenTypeService {
  private screenState = 'mobile'; // assume screen size is mobile initially
  private observer: Observable<string>;

  constructor(breakpointObserver: BreakpointObserver) {
    this.observer = new Observable<string>((observer) => {

      // checking for screen of mobile
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait,
      ]).subscribe({
        next: (result) => {
          if (result.matches) {
            this.screenState = 'mobile';
            observer.next(this.screenState);
          }
        }
      });

      // Check for tablets in portrait mode
      breakpointObserver.observe([
        Breakpoints.Tablet,
        Breakpoints.TabletPortrait
      ]).subscribe({
        next: (result) => {
          if (result.matches) {
            this.screenState = 'tablet';
            observer.next(this.screenState);
          }
        }
      });

     // check for tablets widescreen items
      breakpointObserver.observe([
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.TabletLandscape
      ]).subscribe({
        next: (result) => {
          if (result.matches) {
            this.screenState = 'wideScreen';
            observer.next(this.screenState);
          }
        }
      });
    }); // observer
  }

  getScreenTypeUpdate(): Observable<string>{
    return this.observer;
  }
}
