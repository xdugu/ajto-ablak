import { Component, OnInit, Input } from '@angular/core';

interface LanderFlow{
  title: { en?: string, hu?: string};
  contentText: { en?: string, hu?: string};
  colour: string;
}

@Component({
  selector: 'app-lander',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements OnInit {
  @Input() lang = 'hu';
  @Input() flow: LanderFlow = null;
  @Input() imgSrc: string = null;
  constructor() { }

  ngOnInit(): void {
  }

}
