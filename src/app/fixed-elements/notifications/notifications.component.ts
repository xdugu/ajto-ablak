import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenStorageService } from '@app/shared-services/token-storage.service';
import { ApiManagerService, API_MODE, API_METHOD } from '@app/shared-services/api-manager.service';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { HttpParams } from '@angular/common/http';

export interface INotificationServer{
  ItemId: string,
  StoreId: string,
  LastUpdated: number,
  Info: {
    type: "banner" | "popup"
    contentRef: string
    delay: number
    enabled: boolean
    frequency: number
    lang: string
    match: string
    title: string
  }
}

export interface INotificationStored extends INotificationServer{
  Metadata:{
    lastShown: number,
    visible: boolean
  }
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  lang = "hu"
  storeId = null
  notifications: INotificationStored[] = []
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    private apiService: ApiManagerService,
    private configService: ConfigService,
    private langService: LanguageService
  ) { }

  ngOnInit(): void {
    let localNotis = this.tokenService.getObj("Notifications")
    if(!localNotis){
      localNotis = []
    }
    this.langService.getLang().then(lang => {
      this.lang = lang;
      this.configService.getConfig('storeId').subscribe({
        next: storeId => {
          this.storeId = storeId;
          const httpParams = new HttpParams().set('storeId', storeId);
          this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'notifications', httpParams).subscribe({
            next: (res: INotificationServer[]) => {
              this.notifications = this.updateLocalNotifications(localNotis, res);
              // Save result for later
              this.tokenService.setObj("Notifications", this.notifications)
              this.router.events.subscribe(val => {
                if(val instanceof NavigationEnd){
                  this.updateNotificationVisibility(this.router.url)

                }
              })
              this.updateNotificationVisibility(this.router.url)
            }
          })
        }
      })
    })
  }

  private updateNotificationVisibility(url: string){
    const path = this.determinePath(url)
    for (const notification of this.notifications){
      const exp = new RegExp(notification.Info.match);
      if (path.search(exp)>= 0){
        notification.Metadata.visible = true
      }
      else {
        notification.Metadata.visible = false
      }
    }
  }

  private determinePath(url: string): string {
    let page = 'index'
    if(url.indexOf('category') >= 0){
      page = 'category'
    }
    else if(url.indexOf('product') >= 0){
      page = 'product'
    }
    else if(url.indexOf('basket') >= 0){
      page = 'basket'
    }
    else if (url.indexOf('checkout') >= 0){
      page = 'checkout'
    }
    else if (url.indexOf('contact') >= 0){
      page = 'contact'
    }
    else if (url.indexOf('review') >= 0){
      page = 'review'
    }
    else if (url.indexOf('blog') >= 0){
      page = 'blog'
    }
    return page;
  }

  private updateLocalNotifications(localNotis: INotificationStored[], serverNotis: INotificationServer[]){
    // Remove all local notifications not found on server
    for(const localN of localNotis){
      const serverN = serverNotis.find(item => localN.ItemId === item.ItemId)
      if(!serverN){
        localNotis.splice(localNotis.indexOf(localN), 1)
      }
      else{
        if(serverN.LastUpdated !== localN.LastUpdated){
          localN.Info = serverN.Info
          localN.LastUpdated = serverN.LastUpdated
        }
      }
    }

    // check for new notification from server
    for (const serverN of serverNotis){
      if(!localNotis.find(item => item.ItemId == serverN.ItemId)){
        const localN = JSON.parse(JSON.stringify(serverN)) as INotificationStored
        localN.Metadata = {
          lastShown: 0,
          visible: false
        }
        localNotis.push(localN)
      }
    }

    // at this point, we have an updated list of Notifications we can show if required
    // Filter out notifications that are not enabled
    return localNotis.filter(item => item.Info.enabled)
    
  }

}
