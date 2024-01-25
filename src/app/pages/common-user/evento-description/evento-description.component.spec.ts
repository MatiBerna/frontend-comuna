import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoDescriptionComponent } from './evento-description.component';

describe('EventoDescriptionComponent', () => {
  let component: EventoDescriptionComponent;
  let fixture: ComponentFixture<EventoDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventoDescriptionComponent]
    });
    fixture = TestBed.createComponent(EventoDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
