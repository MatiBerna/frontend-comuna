import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetitorComponent } from './add-competitor.component';

describe('AddCompetitorComponent', () => {
  let component: AddCompetitorComponent;
  let fixture: ComponentFixture<AddCompetitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompetitorComponent]
    });
    fixture = TestBed.createComponent(AddCompetitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
