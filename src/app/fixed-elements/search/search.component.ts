import { Component, OnInit } from '@angular/core';
import { SearchService } from '@app/shared-module/services/search.service';
import { ConfigService } from '@app/shared-services/config.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTerm = null;
  searchResults = [];
  bucketUrl = null;

  constructor(private searchService: SearchService, private configService: ConfigService,
              private dialogRef: MatDialogRef<SearchComponent>) { }

  ngOnInit(): void {
    this.configService.getConfig('imgSrc').subscribe({
      next: url => this.bucketUrl = url
    });
  }

  onItemSelect(selectedItem: string): void{
    this.dialogRef.close({type: 'product', id: selectedItem});
  }

  onSearchTermChange(): void{
    if (this.searchTerm == null || this.searchTerm.length === 0){
      this.searchResults = [];
    }
    else{
      this.searchService.search(this.searchTerm, 10).then(result => this.searchResults = result);
    }
  }

}
