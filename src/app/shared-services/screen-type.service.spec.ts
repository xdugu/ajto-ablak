import { TestBed } from '@angular/core/testing';

import { ScreenTypeService } from './screen-type.service';

describe('ScreenTypeService', () => {
  let service: ScreenTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
