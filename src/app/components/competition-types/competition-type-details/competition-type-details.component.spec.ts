import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionTypeDetailsComponent } from './competition-type-details.component';

describe('CompetitionTypeDetailsComponent', () => {
  let component: CompetitionTypeDetailsComponent;
  let fixture: ComponentFixture<CompetitionTypeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionTypeDetailsComponent]
    });
    fixture = TestBed.createComponent(CompetitionTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
