import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef} from '@angular/material/snack-bar';
import { TokenStorageService } from '@app/shared-services/token-storage.service';

export interface ITrackingInfo{
  trackingEnabled: boolean
  lastTimeDecisionMade: number | null
}

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {

  constructor(
    private snackBarRef: MatSnackBarRef<CookieComponent>,
    private tokenService: TokenStorageService
  ) { 

  }

  onTrackingEnabled(){
    this.snackBarRef.dismiss();
    const trackingData: ITrackingInfo = {
      trackingEnabled: true,
      lastTimeDecisionMade: Date.now()
    }
    this.tokenService.setObj('trackingInfo', trackingData)
  }

  onTrackingDisabled(){
    this.snackBarRef.dismiss();
    const trackingData: ITrackingInfo = {
      trackingEnabled: false,
      lastTimeDecisionMade: Date.now()
    }
    this.tokenService.setObj('trackingInfo', trackingData)
    window.location.reload()
  }

  onMoreInfoRequired(){
    this.snackBarRef.dismiss();
  }



  ngOnInit(): void {
    const trackingInfo: ITrackingInfo | undefined = this.tokenService.getObj("trackingInfo");
    if (trackingInfo && trackingInfo.lastTimeDecisionMade > 0){
        this.snackBarRef.dismiss()
    }
  }


}
