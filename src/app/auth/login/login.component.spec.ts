import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastsComponent } from 'src/app/shared/toasts/toasts.component';
import { of } from 'rxjs';

describe('Test componente LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [LoginComponent, ToastsComponent],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe retornar formulario inválido', () => {
    const form = component.loginForm;
    const email = component.loginForm.controls['username'];
    email.setValue('hola');

    expect(form.invalid).toBeTrue();
  });

  it('Debe retornar formulario válido', () => {
    const form = component.loginForm;
    const email = component.loginForm.controls['username'];
    email.setValue('hola');
    component.loginForm.controls['password'].setValue('chau');

    expect(form.invalid).toBeFalse();
  });
});
