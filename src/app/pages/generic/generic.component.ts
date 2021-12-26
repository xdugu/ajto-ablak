import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { Title } from '@angular/platform-browser';
import {  HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';

// component to render generic pages including about
@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss']
})
export class GenericComponent implements OnInit {
  docRef = null;
  doc = null;
  storeId = null;

  constructor(private configService: ConfigService, private langService: LanguageService,
              private titleService: Title, private apiManager: ApiManagerService) {}

  ngOnInit(): void {
    this.configService.getConfig('storeId').subscribe({
      next: storeId => {
        this.storeId = storeId;
        this.configService.getConfig('pages').subscribe({
          next: pages => {
            this.langService.getLang().then(lang => {
              this.doc = pages.about.documents.find(doc => doc.lang === lang);

              const params = new HttpParams().set('storeId', storeId).set('documentId', this.doc.id);
              this.apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'document', params).subscribe({
                next: (res: any) => {
                  this.docRef = res.item;
                  this.titleService.setTitle(this.docRef.title);
                },
                error: (err) => console.error(err)
              });
            });
          }
        });
    }
    });

  }

}
