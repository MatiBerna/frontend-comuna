import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Person } from 'src/app/models/person';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  path: string = 'http://localhost:3000/api/person';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.http
      .get<Person[]>(`${this.path}`)
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
}
