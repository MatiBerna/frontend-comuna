import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventoComponent } from './add-evento.component';

describe('AddEventoComponent', () => {
  let component: AddEventoComponent;
  let fixture: ComponentFixture<AddEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEventoComponent]
    });
    fixture = TestBed.createComponent(AddEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
