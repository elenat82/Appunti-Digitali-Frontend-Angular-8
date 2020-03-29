import { TestBed } from '@angular/core/testing';

import { StackoverflowService } from './stackoverflow.service';

describe('StackoverflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StackoverflowService = TestBed.get(StackoverflowService);
    expect(service).toBeTruthy();
  });
});
