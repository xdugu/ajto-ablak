import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  legalDocs: [] = null;
  storeId: string = null;
  lang: string = null;

  constructor(private configService: ConfigService, private langService: LanguageService,
              private titleService: Title) { }

  ngOnInit(): void {
    this.configService.getConfig('pages').subscribe({
      next: pages => this.legalDocs = pages.legal.documents
    });

    this.configService.getConfig('storeId').subscribe({
      next: storeId => this.storeId = storeId
    });

    this.langService.getLang().then(lang => {
      this.lang = lang;
      const titles = {
        en: 'Legal Information',
        hu: 'Jogi információk'
      };
      this.titleService.setTitle(titles[lang]);
    });
  }

}
