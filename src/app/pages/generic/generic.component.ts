import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { Title } from '@angular/platform-browser';
import { AbsoluteSourceSpan } from '@angular/compiler';

// component to render generic pages including about
@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss']
})
export class GenericComponent implements OnInit {
  doc = null;
  storeId = null;

  constructor(private configService: ConfigService, private langService: LanguageService,
              private titleService: Title) {}

  ngOnInit(): void {
    this.configService.getConfig('storeId').subscribe({
      next: storeId => this.storeId = storeId
    });

    this.configService.getConfig('pages').subscribe({
      next: pages => {
        this.langService.getLang().then(lang => {
          this.doc = pages.about.documents.find(doc => doc.lang === lang);
          const aboutTitle = {
            en: 'About',
            hu: 'Rólunk'
          };
          this.titleService.setTitle(aboutTitle[lang]);
        });
      }
    });
  }

}
