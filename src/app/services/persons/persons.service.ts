import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Person } from 'src/app/models/person';
import { ErrorService } from '../error/error.service';
import { PaginationResponse } from 'src/app/models/paginationResponse';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  path: string = 'http://localhost:3000/api/person';
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAll(filter: string | null, page: number): Observable<PaginationResponse> {
    let query: string = `?page=${page}`;
    if (filter) {
      query = query + `&filter=${filter}`;
    }
    return this.http
      .get<PaginationResponse>(`${this.path}${query}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  addOrUpdate(persona: Person) {
    if (persona._id === null || persona._id === '') {
      return this.http
        .post<Person>(`${this.path}`, persona)
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch(`${this.path}/${persona._id}`, persona, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  delete(persona: Person) {
    return this.http
      .delete<Person>(`${this.path}/${persona._id}`, this.createHeaders())
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
