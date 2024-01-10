import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  path: string = 'http://localhost:3000/api/admin';
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  public getAll(): Observable<Admin[]> {
    return this.http
      .get<Admin[]>(`${this.path}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

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

  public delete(admin: Admin) {
    return this.http
      .delete(`${this.path}/${admin._id}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      console.log(`Se ha producido un error: ${error.error}`);
      return throwError(
        () => new Error('Algo falló. Por favor intente nuevamente')
      );
    } else if (error.status === 400) {
      console.log('Error de tipo 400:', error.error.errors);
      this.errorService.sendErrors(error.error.errors);
      return throwError(() => new Error('Error en los datos ingresados'));
    } else {
      console.log(
        'Backend retornó el código de estado: ',
        error.status,
        error.error
      );
      return throwError(() => new Error(error.error.message));
    }
  };

  private createHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('token_session')!,
      }),
    };
  }
}
