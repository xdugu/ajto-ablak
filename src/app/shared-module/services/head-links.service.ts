import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HeadLinksService {

  constructor(@Inject(DOCUMENT) private dom) { }

  createLinkURL(rel: string, type: string, url: string): void {
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('type', type);
    this.dom.head.appendChild(link);
    link.setAttribute('href', url);
 }
}
