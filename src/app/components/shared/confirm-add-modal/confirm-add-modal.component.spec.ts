import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddModalComponent } from './confirm-add-modal.component';

describe('ConfirmAddModalComponent', () => {
  let component: ConfirmAddModalComponent;
  let fixture: ComponentFixture<ConfirmAddModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAddModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
