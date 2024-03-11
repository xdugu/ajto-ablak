import { Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {  HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';

@Directive({
  selector: '[appDocument]'
})
export class DocumentDirective implements OnChanges{
  @Input() appDocument: string = null;
  @Input() storeId: string = null;
  @Input() titleRef = null;
  @Input() contentRef = null;

  constructor(private el: ElementRef, private apiService: ApiManagerService) {
    if (this.appDocument != null && this.storeId != null){
      this.getDocument();
    }
  }

  ngOnChanges(): void{
    if (this.appDocument != null && this.storeId != null){
      this.getDocument();
    }
  }

  private getDocument(): void{
    const params = new HttpParams()
              .set('storeId', this.storeId)
              .set('documentId', this.appDocument);

    this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'document', params).subscribe({
      next: (doc: any) => {
        if (this.titleRef){
          this.titleRef.innerHTML = doc.Info.title;
        }

        if (this.contentRef){
         this.contentRef.innerHTML = doc.Info.content;
        }
      }
    });

  }

}
