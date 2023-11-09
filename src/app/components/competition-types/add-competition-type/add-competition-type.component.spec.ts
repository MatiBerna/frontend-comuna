import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetitionTypeComponent } from './add-competition-type.component';

describe('AddCompetitionTypeComponent', () => {
  let component: AddCompetitionTypeComponent;
  let fixture: ComponentFixture<AddCompetitionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompetitionTypeComponent]
    });
    fixture = TestBed.createComponent(AddCompetitionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
