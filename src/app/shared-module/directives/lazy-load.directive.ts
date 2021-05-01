import { Directive, Input, ElementRef, SimpleChanges, AfterContentInit, OnChanges, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements AfterContentInit, OnChanges{

  constructor(private elemRef: ElementRef,
              @Inject(PLATFORM_ID) private platformId: object) { }

  // input to real img src to lazy load
  @Input('appLazyLoad') src: string;

  private wasVisible = false;

  ngAfterContentInit(): void{

    if (isPlatformBrowser(this.platformId)) {
      // get reference to element
      const elem = this.elemRef.nativeElement;

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
    else{ // set image source if server side rendered
      this.elemRef.nativeElement.src = this.src;
    }
  }

  // watch for changes in the appLazyLoad input in case a new image needs to be loaded
  ngOnChanges(changes: SimpleChanges): void {

    if (this.wasVisible){
      this.elemRef.nativeElement.src = changes.appLazyLoad.currentValue;
    }

  }

}
