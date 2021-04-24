import { Directive, Input, ElementRef, SimpleChanges, AfterContentInit, OnChanges } from '@angular/core';
import 'jquery';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements AfterContentInit, OnChanges{

  constructor(private elemRef: ElementRef) { }

  // input to real img src to lazy load
  @Input('appLazyLoad') src: string;
  @Input() keepSizing: boolean; // indicator to know if we need to change height for every image not loaded

  private wasVisible = false;

  ngAfterContentInit(): void{
    // get reference to elemet
    const elem = this.elemRef.nativeElement;
    const cssHeight = $(elem).css('height');

    if (!this.keepSizing){
     // $(elem).css('height', '500px');
    }

    // set options for margins for observer
    const options = {
      root: null,
      rootMargin: '30% 10% 80% 10%', // setting margin to prempt loading
      threshold: 0
    };

    // save reference to private variable to be used in function
    const loadImg = (changes: any) => {
      for (const change of changes){
        if (change.intersectionRatio > 0){
          if (!change.target.src.includes(this.src) && this.src !== undefined){
            change.target.src = this.src;

            // readjust image height
            // $(elem).css('height', cssHeight === '0px' ? 'auto' : cssHeight);
            this.wasVisible = true;

            // unobserve element after setting src
            observer.unobserve(elem);
          }
        }
      }
    };

    const observer = new IntersectionObserver(loadImg, options);
    observer.observe(elem);
  }

  // watch for changes in the appLazyLoad input in case a new image needs to be loaded
  ngOnChanges(changes: SimpleChanges): void {

    if (this.wasVisible){
      this.elemRef.nativeElement.src = changes.appLazyLoad.currentValue;
    }

  }

}
