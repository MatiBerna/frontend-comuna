import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorsComponent } from './competitors.component';

describe('CompetitorsComponent', () => {
  let component: CompetitorsComponent;
  let fixture: ComponentFixture<CompetitorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitorsComponent]
    });
    fixture = TestBed.createComponent(CompetitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
