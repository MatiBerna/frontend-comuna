import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Evento } from 'src/app/models/evento';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  path: string = 'http://localhost:3000/api/evento';

  constructor(private http: HttpClient) {}

  getAll(query: string): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.path}${query}`)
      .pipe(catchError(this.handleError));
  }

  addOrUpdate(evento: Evento) {
    if (evento._id === null || evento._id === '') {
      return this.http
        .post<Evento>(`${this.path}`, evento)
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch<Evento>(`${this.path}/${evento._id}`, evento)
      .pipe(catchError(this.handleError));
  }

  delete(evento: Evento) {
    return this.http
      .delete<Evento>(`${this.path}/${evento._id}`)
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
