import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Admin } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  path: string = 'http://localhost:3000/api/admin';
  constructor(private http: HttpClient) {}

  public addOrEdit(admin: Admin): Observable<Admin> {
    if (admin._id === null || admin._id === '') {
      return this.http
        .post<Admin>(`${this.path}`, admin, this.createHeaders())
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch<Admin>(`${this.path}/${admin._id}`, admin, this.createHeaders())
      .pipe(catchError(this.handleError));
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

  private createHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('token_session')!,
      }),
    };
  }
}
