import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/shared-services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService } from '@app/shared-services/language.service';
import { ApiManagerService, API_METHOD, API_MODE} from '@app/shared-services/api-manager.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent, DialogInterface} from '@app/shared-module/components/dialog/dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  lang = 'hu';
  extraQuestions = [];

  // model to store user entries
  user = {
      name: null,
      email: null,
      comments: '',
      requestType: 'Request',
      topic: 'General',
      storeId: null
  };

  messages = {
    success: {
      title: {
        en: 'Request successfully sent',
        hu: 'Köszönjük',
        de: 'Danke'
      },
      content: {
        en: 'Thank you. We will reply back soon',
        hu: 'Köszönjük. Hamarosan válaszolunk',
        de: 'Wir werden bald antworten'
      }
    },

    failure: {
      title: {
        en: 'Error',
        hu: 'Valami hiba történt',
        de: ''
      },
      content: {
        en: 'Unfortunately, something went wrong. Please try again later :(',
        hu: 'Kérjuk, próbáld újra később',
        de: 'Es ist ein Problem aufgetreten. Bitte versuchen Sie es erneut.'
      }
    }
  };

  constructor(configService: ConfigService, private apiService: ApiManagerService,
              private dialog: MatDialog, private router: Router, langService: LanguageService,
              private title: Title, private routeInfo: ActivatedRoute) {

    configService.getConfig('storeId').subscribe({
      next: storeId => this.user.storeId = storeId
    });

    langService.getLang().then(lang => {
      this.lang = lang;
      const titles = {
        en: 'Contact us',
        hu: 'Kapcsolat'
      };
      this.title.setTitle(titles[lang]);
    });


  }

  ngOnInit(): void {
    const params = this.routeInfo.queryParams;
    params.subscribe({
      next: param => {
        const topic = param.topic;
        const questions = param.questions;
        if (topic){
          this.user.topic = topic;
        }
        if (questions){
          this.extraQuestions = questions.split(',');
          for (const question of this.extraQuestions){
            this.user[question] = null;
          }
        }
      }
    });
  }

  // called when the user submits a request
  onRequestSubmit(): void{

    // send request by post
    this.apiService.post(API_MODE.OPEN, API_METHOD.CREATE, 'request', new HttpParams(), this.user)
      .subscribe(() => {
        const dialogData: DialogInterface = {
          title: this.messages.success.title[this.lang],
          content: this.messages.success.content[this.lang],
          buttons: []
        };
        const dialogConfirm = this.dialog.open(DialogComponent, {
          data: dialogData
        });

        // after showing of successful request is shown and closed, redirect user to homepage
        dialogConfirm.afterClosed().subscribe(() => {
            this.router.navigate(['/']);
        });
      },
      (err) => {
        console.log(err);
        const dialogData: DialogInterface = {
          title: this.messages.failure.title[this.lang],
          content: this.messages.failure.content[this.lang],
          buttons: []
        };
        this.dialog.open(DialogComponent, {
          data: dialogData
        });

      });
  }

}
