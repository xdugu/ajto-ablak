import { TestBed } from '@angular/core/testing';

import { ProductGetterService } from './product-getter.service';

describe('ProductGetterService', () => {
  let service: ProductGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
