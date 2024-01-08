import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Competition } from 'src/app/models/competition';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  path: string = 'http://localhost:3000/api/competition';

  constructor(private http: HttpClient) {}

  getAll(query: string): Observable<Competition[]> {
    return this.http
      .get<Competition[]>(`${this.path}${query}`)
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
