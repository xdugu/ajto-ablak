import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyChooserComponent } from './currency-chooser.component';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';

// define template of component to test currency chooser
@Component({
  template: `<app-currency-chooser [chosen]="chosen"
              [available]="available"
              [position]= "position"
              (currencyChange)="onCurrencyChange($event)">
            </app-currency-chooser>`
})
export class TestComponent {
   chosen = 'HUF';
   available = ['HUF', 'GBP', 'EUR'];
   position = 'left';

   //funtion will be used to check for click/selection events
   onCurrencyChange(_){}
}


describe('CurrencyChooserComponent', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  // function that runs before every testcase
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyChooserComponent, TestComponent ],
      imports:[MatChipsModule]
    })
    .compileComponents();
  }));

  // instantiate a new instance of TestComponent before every test
  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testComponent).toBeTruthy();
  });

  // function to test that all requested currencies are available
  it('should show all the available currencies', ()=>{
    let chips;
    chips = fixture.debugElement.queryAll(By.css('mat-chip'));
    expect(chips.length).toBe(testComponent.available.length);
    chips.forEach((chip, index) =>{
        expect(chip.nativeNode.innerText).toBe(testComponent.available[index]);
    })
  })

  it('should highlight the selected module', ()=>{
    let chips;

    testComponent.chosen = 'HUF';
    fixture.detectChanges();
    chips = fixture.debugElement.queryAll(By.css('mat-chip'))
    expect(chips[0].attributes['ng-reflect-selected']).toBe('true');
    expect(chips[1].attributes['ng-reflect-selected']).toBe('false');
    expect(chips[2].attributes['ng-reflect-selected']).toBe('false');

    testComponent.chosen = 'GBP';
    fixture.detectChanges();
    chips = fixture.debugElement.queryAll(By.css('mat-chip'))
    expect(chips[0].attributes['ng-reflect-selected']).toBe('false');
    expect(chips[1].attributes['ng-reflect-selected']).toBe('true');
    expect(chips[2].attributes['ng-reflect-selected']).toBe('false');

    testComponent.chosen = 'EUR';
    fixture.detectChanges();
    chips = fixture.debugElement.queryAll(By.css('mat-chip'))
    expect(chips[0].attributes['ng-reflect-selected']).toBe('false');
    expect(chips[1].attributes['ng-reflect-selected']).toBe('false');
    expect(chips[2].attributes['ng-reflect-selected']).toBe('true');
  });

  it('should justify content as requested', ()=>{
    let chip;

     testComponent.position = 'center';
     fixture.detectChanges();
     chip = fixture.debugElement.query(By.css('mat-chip-list'));
     expect(chip.styles['justify-content']).toBe('center');

     testComponent.position = 'left';
     fixture.detectChanges();
     chip = fixture.debugElement.query(By.css('mat-chip-list'));
     expect(chip.styles['justify-content']).toBe('left');

     testComponent.position = 'right';
     fixture.detectChanges();
     chip = fixture.debugElement.query(By.css('mat-chip-list'));
     expect(chip.styles['justify-content']).toBe('right');

  });

  it('should emit events when currency choice is clicked', ()=>{
     let chips = fixture.debugElement.queryAll(By.css('mat-chip'));
     spyOn(testComponent, 'onCurrencyChange');

     // select and click a different currency (in this case, should be 'EUR')
     chips[2].triggerEventHandler('click', null);
     expect(testComponent.onCurrencyChange).toHaveBeenCalledWith(testComponent.available[2]);

  })
});
