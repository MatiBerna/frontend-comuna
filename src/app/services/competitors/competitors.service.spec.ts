import { TestBed } from '@angular/core/testing';

import { CompetitorsService } from './competitors.service';

describe('CompetitorsService', () => {
  let service: CompetitorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
