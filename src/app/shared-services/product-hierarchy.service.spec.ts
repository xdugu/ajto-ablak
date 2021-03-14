import { TestBed } from '@angular/core/testing';

import { ProductHierarchyService } from './product-hierarchy.service';

describe('ProductHierarchyService', () => {
  let service: ProductHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
