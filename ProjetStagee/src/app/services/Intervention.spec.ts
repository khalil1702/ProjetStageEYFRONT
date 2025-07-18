import { TestBed } from '@angular/core/testing';

import { Interventionn } from '../models/Interventionn';

describe('Intervention', () => {
  let service: Interventionn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Interventionn);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
