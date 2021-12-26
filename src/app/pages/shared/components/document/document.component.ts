import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {  HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnChanges {
  @Input() documents: string[] = [];
  @Input() storeId = null;
  @Input() width = '800px';
  docs: any[] = null;

  constructor(private apiService: ApiManagerService) { }

  ngOnInit(): void {
    if (this.documents && this.documents.length > 0 && this.storeId){
      this.getDocuments();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documents && this.documents.length > 0 && this.storeId){
      this.getDocuments();
    }
  }

  private getDocuments(): void{
    const params = new HttpParams()
              .set('storeId', this.storeId)
              .set('documentIds', this.documents.join(','));

    this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'documents', params).subscribe({
      next: (res: any) => {
        this.docs = res.item;
      }
    });

  }

}
