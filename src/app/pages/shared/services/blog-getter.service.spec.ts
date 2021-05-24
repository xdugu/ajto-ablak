import { TestBed } from '@angular/core/testing';

import { BlogGetterService } from './blog-getter.service';

describe('BlogGetterService', () => {
  let service: BlogGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
