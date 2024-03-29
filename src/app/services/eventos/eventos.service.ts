import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { ErrorService } from '../error/error.service';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  path: string = `${environment.apiUrl}/evento`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAll(
    page: number | null,
    filter: string | null,
    prox: string | null
  ): Observable<PaginationResponse> {
    let query: string = '?';
    if (page) query += `page=${page}&`;
    if (filter) query += `filter=${filter}&`;
    if (prox) query += `prox=${prox}`;
    return this.http
      .get<PaginationResponse>(`${this.path}${query}`)
      .pipe(catchError(this.handleError));
  }

  getOne(id: string): Observable<Evento> {
    return this.http
      .get<Evento>(`${this.path}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addOrUpdate(evento: Evento) {
    if (evento._id === null || evento._id === '') {
      return this.http
        .post<Evento>(`${this.path}`, evento, this.createHeaders())
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch<Evento>(`${this.path}/${evento._id}`, evento, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  delete(evento: Evento) {
    return this.http
      .delete<Evento>(`${this.path}/${evento._id}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  private createHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('token_session')!,
      }),
    };
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
}
