import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ScreenTypeService} from './shared-services/screen-type.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ajto-ablak';
  sideBarVisible = false;
  sideBarMode = 'push';
  currentView = 'mobile';

  constructor(screenTypeService: ScreenTypeService, router: Router){
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => this.onScreenSizeChange(state)
    });

    // listen to route change events to hide sidebar in mobile devices
    router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart && this.currentView === 'mobile'){
          this.sideBarVisible = false;
        }
      }
    });

  }

  // reacts to changes in screen size
  private onScreenSizeChange(newScreenSize: string): void{
    this.currentView = newScreenSize;
    switch (newScreenSize){
      case 'wideScreen':
        this.sideBarVisible = true;
        this.sideBarMode = 'side';
        break;

      case 'mobile':
        this.sideBarVisible = false;
        this.sideBarMode = 'push';
        break;

      default:
        this.sideBarVisible = false;
        this.sideBarMode = 'push';
        break;
    }
  }

  onMenuButtonClickedInNav(): void{
    if (this.currentView === 'tablet' || this.currentView === 'mobile'){
      this.sideBarVisible = !this.sideBarVisible;
    } // if
  }
}
