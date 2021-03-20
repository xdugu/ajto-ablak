import { TestBed } from '@angular/core/testing';

import { CategoryGetterService } from './category-getter.service';

describe('CategoryGetterService', () => {
  let service: CategoryGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
