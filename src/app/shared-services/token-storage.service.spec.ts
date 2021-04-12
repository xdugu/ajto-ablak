import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  afterEach(()=>{
    localStorage.clear();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // check saved string is savedcorrectly
  it('should save a string', ()=>{
     service.setString('testId', 'testData');
     expect(localStorage.getItem('testId')).toEqual('testData');
  })

  //check getting stringback
  it('should return correct string', ()=>{
     localStorage.setItem('testId', 'testData');
     expect(service.getString('testId')).toEqual('testData');
  })

  //check object is saved correctly
  it('should save object', ()=>{
      service.setObj('testId', {'Test': 'test'});
      expect(service.getObj('testId')).toEqual({'Test': 'test'});
  });

  //check object is returned correctly
  it('should return correct object', ()=>{
    localStorage.setItem('testId', JSON.stringify({'Test': 'test'}));
    expect(service.getObj('testId')).toEqual({'Test': 'test'});
 })
});
