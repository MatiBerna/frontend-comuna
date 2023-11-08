import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Admin } from '../../models/admin';
import { UserAndToken } from './userAndToken';
import {
  expirationTokenAuth,
  getDecodedAccessToken,
} from 'src/app/utils/tokenValidations';
import { Person } from 'src/app/models/person';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<Admin | Person> = new BehaviorSubject<
    Admin | Person
  >({
    _id: '',
  });

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<UserAndToken> {
    return this.http
      .post<UserAndToken>(
        'http://localhost:3000/api/auth/admin/login',
        credentials
      )
      .pipe(
        tap((userData: UserAndToken) => {
          console.log('Antes de asignar a observables', userData);
          console.log(this.currentUserData);
          this.currentUserData.next(userData.data);
          console.log('durante asignar obs');
          this.currentUserLoginOn.next(true);
          console.log('luego');
        }),
        catchError(this.handleError)
      );
  }

  checkLoginStatus(): void {
    let token = sessionStorage.getItem('token_session');
    if (token !== null) {
      if (expirationTokenAuth(token)) {
        // El token ha expirado
        this.currentUserLoginOn.next(false);
        sessionStorage.removeItem('token_session');
      } else {
        // El token es válido
        this.currentUserLoginOn.next(true);
        const decodedToken = getDecodedAccessToken(token);
        this.currentUserData.next(decodedToken.user);
      }
    } else {
      // No hay token
      this.currentUserLoginOn.next(false);
    }
  }

  logOut(): void {
    this.checkLoginStatus();
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 0) {
      console.log(`Se ha producido un error: ${error.error}`);
      return throwError(
        () => new Error('Algo falló. Por favor intente nuevamente')
      );
    } else {
      console.log(
        'Backend retornó el código de estado: ',
        error.status,
        error.error
      );
      return throwError(() => new Error(error.error.message));
    }
  }

  get userData(): Observable<Admin | Person> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
