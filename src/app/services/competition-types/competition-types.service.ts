import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CompetitionType } from 'src/app/models/competition-type';
import { ErrorService } from '../error/error.service';
import { PaginationResponse } from 'src/app/models/paginationResponse';

@Injectable({
  providedIn: 'root',
})
export class CompetitionTypesService {
  path: string = 'http://localhost:3000/api/competition-type';
  constructor(private errorService: ErrorService, private http: HttpClient) {}

  getAll(
    filter: string | null,
    page: number | null
  ): Observable<PaginationResponse> {
    let query: string = '';
    if (page) {
      query = `?page=${page}`;
    }
    if (filter) {
      query = query + `&filter=${filter}`;
    }
    return this.http
      .get<PaginationResponse>(`${this.path}${query}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  addOrUpdate(compeType: CompetitionType) {
    if (compeType._id === null || compeType._id === '') {
      return this.http
        .post<CompetitionType>(`${this.path}`, compeType, this.createHeaders())
        .pipe(catchError(this.handleError));
    }
    return this.http
      .patch(`${this.path}/${compeType._id}`, compeType, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  delete(compeType: CompetitionType) {
    return this.http
      .delete<CompetitionType>(
        `${this.path}/${compeType._id}`,
        this.createHeaders()
      )
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
