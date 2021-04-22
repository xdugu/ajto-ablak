import { Directive, ElementRef, Input, OnChanges} from '@angular/core';

// this directive displays the right image based on the requested width

@Directive({
  selector: '[appImageSource]'
})
export class ImageSourceDirective implements OnChanges{
  @Input() appImageSource: string;
  @Input() width = null;

  constructor(private el: ElementRef) {
    if (this.appImageSource != null || this.appImageSource !== undefined){
      el.nativeElement.src = this.getFinalImageSource(this.appImageSource, this.width);
    }
  }

  ngOnChanges(): void{
    if (this.appImageSource != null || this.appImageSource !== undefined){
      this.el.nativeElement.src = this.getFinalImageSource(this.appImageSource, this.width);
    }
  }

  getFinalImageSource(url: string, width: number): string{
    const extInd = url.search(/\.[a-z]{2,}$/i);

    if (extInd >= 0 && width != null){
      const urlWithoutExt = url.substring(0, extInd);
      return urlWithoutExt + '_' + width.toString() + 'w' + url.substring(extInd).toLowerCase();
    }
    else{
      return url;
    }
  }

}
