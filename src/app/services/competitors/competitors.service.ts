import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { Competitor } from 'src/app/models/competitor';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class CompetitorsService {
  path: string = 'http://localhost:3000/api/competitor';

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAll(
    page: number,
    competition?: string,
    person?: string
  ): Observable<PaginationResponse> {
    let query: string = `?page=${page}`;
    if (competition) query += `&competition=${competition}`;
    if (person) query += `&person=${person}`;

    return this.http
      .get<PaginationResponse>(`${this.path}${query}`, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  add(competitor: Competitor) {
    return this.http
      .post<Competitor>(`${this.path}`, competitor, this.createHeaders())
      .pipe(catchError(this.handleError));
  }

  delete(competitor: Competitor) {
    return this.http
      .delete<Competitor>(
        `${this.path}/${competitor._id}`,
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
