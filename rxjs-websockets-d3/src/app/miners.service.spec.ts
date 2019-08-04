import { TestBed } from '@angular/core/testing';

import { MinersService } from './miners.service';

describe('MinersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinersService = TestBed.get(MinersService);
    expect(service).toBeTruthy();
  });
});
