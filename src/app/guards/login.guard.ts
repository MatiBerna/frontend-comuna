import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { expirationTokenAuth } from '../utils/tokenValidations';

export const loginGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token_session');

  if (token !== null) {
    if (!expirationTokenAuth(token)) {
      return true;
    } else {
      sessionStorage.removeItem('token_session');
      return false;
    }
  } else {
    router.navigate(['login']);
    return false;
  }
};
