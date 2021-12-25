import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Directive({
  selector: '[appDocumentLoader]'
})
export class DocumentLoaderDirective implements OnChanges {
  @Input() url = null;
  constructor(private el: ElementRef, private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
      if (this.url !== null){
        this.loadUrl();
      }
  }

  private loadUrl(): void{
    this.http.get(this.url, {responseType: 'text'}).subscribe({
      next: (res: any) => {
        this.el.nativeElement.innerHTML = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
