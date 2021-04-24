import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed } from '@angular/core/testing';
import {LazyLoadDirective} from './lazy-load.directive';
import {By} from '@angular/platform-browser';
import 'jquery';

@Component({
    template: `
    <div style="height: 2000px"></div>
    <img [appLazyLoad]="'/target/img/to/load.jpg'" id="test-image">
    `  
})

class TestComponent { }


describe('Lazy-Load-Directive-test', () => {
    let des: DebugElement;
    let fixture: ComponentFixture<TestComponent>;


    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
          declarations: [ LazyLoadDirective, TestComponent ]
        })
        .createComponent(TestComponent);
      
        fixture.detectChanges(); // initial binding

        // all elements with an attached HighlightDirective
        des = fixture.debugElement.query(By.directive(LazyLoadDirective));
      
      });

    afterEach(()=>{
        window.scrollTo(0, 0);
    });

    it('should not load target image as not visible', ()=>{
        expect(des.nativeElement.src.search('/target/img/to/load.jpg')).toBeLessThan(0);
    })

    it('should attempt to load target image as now visible', (done)=>{
        des.nativeElement.scrollIntoView();

        setTimeout(()=>{
            expect(des.nativeElement.src.search('/target/img/to/load.jpg')).toBeGreaterThanOrEqual(0);
            done();
        }, 100)
        
    })
      


});