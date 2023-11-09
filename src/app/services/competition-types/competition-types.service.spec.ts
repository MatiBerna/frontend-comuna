import { TestBed } from '@angular/core/testing';

import { CompetitionTypesService } from './competition-types.service';

describe('CompetitionTypesService', () => {
  let service: CompetitionTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
