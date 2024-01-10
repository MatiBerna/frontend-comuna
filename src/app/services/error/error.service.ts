import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errors = new Subject<any>();

  sendErrors(errores: any) {
    this.errors.next(errores);
  }
}
