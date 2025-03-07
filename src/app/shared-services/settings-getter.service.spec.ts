import { TestBed } from '@angular/core/testing';

import { SettingsGetterService } from './settings-getter.service';

describe('SettingsGetterService', () => {
  let service: SettingsGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
