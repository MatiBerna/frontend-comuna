import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { ToastService } from '../shared/toast/toast.service';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAndToken } from './userAndToken';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientSpy: { post: jasmine.Spy };
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    jasmine.createSpyObj('ToastService', ['show']);
    service = new LoginService(httpClientSpy as any, toastServiceSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería retornar login correcto', (done: DoneFn) => {
    const mockLoginCredentials = {
      username: 'admin',
      password: '1234',
    };

    const mockLoginResult = {
      data: {
        _id: '652885ec05beaa28fe74e0bb',
        username: 'admin',
        role: 'SA',
        updatedAt: '2023-12-14T13:46:00.872Z',
      },
      tokenSession: 'token-unico',
    };

    httpClientSpy.post.and.returnValue(of(mockLoginResult));

    service.login(mockLoginCredentials).subscribe((result) => {
      expect(result.data).toEqual(mockLoginResult.data);
      expect(result.tokenSession).toBeTruthy();
      done();
    });
  });

  it('Debería retornar error 401 Unauthorized', (done: DoneFn) => {
    const mockLoginCredentials = {
      username: 'admin',
      password: '12',
    };

    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Nombre de usuario o contraseña incorrectos' },
    });

    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

    service.login(mockLoginCredentials).subscribe({
      error: (errorData) => {
        expect(errorData.message).toEqual(errorResponse.error.message);
        done();
      },
    });
  });
});
