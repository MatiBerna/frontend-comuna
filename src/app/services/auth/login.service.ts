import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Admin } from './admin';
import { UserAndToken } from './userAndToken';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<Admin> = new BehaviorSubject<Admin>({
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
          this.currentUserData.next(userData.data);
          this.currentUserLoginOn.next(true);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
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

  get userData(): Observable<Admin> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
