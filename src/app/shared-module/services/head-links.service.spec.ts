import { TestBed } from '@angular/core/testing';

import { HeadLinksService } from './head-links.service';

describe('HeadLinksService', () => {
  let service: HeadLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
