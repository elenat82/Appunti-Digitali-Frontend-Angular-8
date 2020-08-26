import { TestBed, async, inject } from '@angular/core/testing';

import { ArticoloGuard } from './articolo.guard';

describe('ArticoloGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticoloGuard]
    });
  });

  it('should ...', inject([ArticoloGuard], (guard: ArticoloGuard) => {
    expect(guard).toBeTruthy();
  }));
});
