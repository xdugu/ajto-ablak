import { Component, OnInit, EventEmitter, Output, Input, ElementRef, OnChanges, AfterContentInit, AfterViewInit} from '@angular/core';
import 'jquery';

@Component({
  selector: 'app-currency-chooser',
  templateUrl: './currency-chooser.component.html',
  styleUrls: ['./currency-chooser.component.css']
})


export class CurrencyChooserComponent implements OnInit, OnChanges, AfterViewInit {

// chosen is a 'string' of the chosen currency e.g. HUF
 @Input() chosen: string;

 // available is a string array of available currencies e.g. ['HUF', 'GBP']
 @Input() available: string[];

// available is a string with the options: 'center'(default), 'left', 'right'
 @Input() position: string;

// We emit this event when user changes the currency they prefer
 @Output() currencyChange = new EventEmitter();


  constructor(private el: ElementRef) {
  }

  ngOnInit(): void{
  }

  // we need to better position the position of the currency chooser
  ngAfterViewInit(): void {
    this.checkContentAlignment();
  }

  ngOnChanges(): void{
    this.checkContentAlignment();
  }

  // aligns the position of the currency selection list
  checkContentAlignment(): void {
    const elem = this.el.nativeElement;
    const chipList = $(elem).find('mat-chip-list')[0];

    if (this.position !== undefined || this.position != null){
      switch (this.position.toLowerCase()){
        case 'left':
          $(chipList).css({'justify-content': 'left'});
          break;

        case 'right':
          $(chipList).css({'justify-content': 'right'});
          break;

        default:
          $(chipList).css({'justify-content': 'center'});
      }
    }
  }

  // called to emit event for currency change
  onCurrencyChange(chosenCurrency: string): void{
    this.currencyChange.emit(chosenCurrency);
  }

}
