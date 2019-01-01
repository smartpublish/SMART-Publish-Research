import { TestBed } from '@angular/core/testing';

import { MyWorkService } from './my-work.service';

describe('MyWorkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyWorkService = TestBed.get(MyWorkService);
    expect(service).toBeTruthy();
  });
});
