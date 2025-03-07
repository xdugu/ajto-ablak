import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';
import { ConfigService } from '@app/shared-services/config.service';

@Directive({
  selector: '[appDocumentLoader]'
})
export class DocumentLoaderDirective implements OnChanges {
  @Input() urlOrRef = null;
  private _url = null;
  private storeId;
  constructor(private el: ElementRef, private http: HttpClient,
              private apiService: ApiManagerService, private configService: ConfigService) {
    this.configService.getConfig('storeId').subscribe({
      next: (storeId) => {this.storeId = storeId}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.urlOrRef !== null){
        this.loadUrl();
      }
  }

  private loadUrl(): void{
    if(this.urlOrRef.search('http') != 0){
      const params = new HttpParams().set('storeId', this.storeId).set('documentId', this.urlOrRef);
      this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'document', params).subscribe({
        next: (doc: any) => {
          doc = doc.item
          this._loadUrl(doc.contentLink)
        }
      });
    }
    else {
      this._loadUrl(this.urlOrRef)
    }
   
  }

  private _loadUrl(url: string){
    this.http.get(url, {responseType: 'text'}).subscribe({
      next: (res: any) => {
        this.el.nativeElement.innerHTML = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}