import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Competition } from 'src/app/models/competition';
import { ErrorService } from '../error/error.service';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  path: string = `${environment.apiUrl}/competition`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAll(
    page: number,
    prox?: boolean,
    disp?: boolean,
    evento?: string,
    compeType?: string,
    idEvento?: string
  ): Observable<PaginationResponse> {
    let query: string = '?';
    if (page) query += `page=${page}&`;
    if (evento) query += `evento=${evento}&`;
    if (compeType) query += `compeType=${compeType}&`;
    if (prox) query += `prox=${prox}&`;
    if (disp) query += `disp=${disp}&`;
    if (idEvento) query += `idEvento=${idEvento}&`;
    return this.http
      .get<PaginationResponse>(`${this.path}${query}`)
      .pipe(catchError(this.handleError));
  }

  getOne(id: string): Observable<Competition> {
    return this.http
      .get<Competition>(`${this.path}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addOrUpdate(competition: Competition): Observable<Competition> {
    if (competition._id === null || competition._id === '') {
      return this.http
        .post<Competition>(`${this.path}`, competition, this.createHeaders())
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch<Competition>(
        `${this.path}/${competition._id}`,
        competition,
        this.createHeaders()
      )
      .pipe(catchError(this.handleError));
  }

  delete(competition: Competition): Observable<Competition> {
    return this.http
      .delete<Competition>(
        `${this.path}/${competition._id}`,
        this.createHeaders()
      )
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
