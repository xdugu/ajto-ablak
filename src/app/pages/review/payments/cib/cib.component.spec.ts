import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibComponent } from './cib.component';

describe('CibComponent', () => {
  let component: CibComponent;
  let fixture: ComponentFixture<CibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
