import { Component } from '@angular/core';
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

  constructor(screenTypeService: ScreenTypeService){
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => this.onScreenSizeChange(state)
    });

  }

  // reacts to changes in screen size
  private onScreenSizeChange(newScreenSize: string): void{
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
}
