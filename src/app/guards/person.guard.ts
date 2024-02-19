import { Router } from '@angular/router';
import { getDecodedAccessToken } from '../utils/tokenValidations';
import { inject } from '@angular/core';

export function personGuard() {
  const token = sessionStorage.getItem('token_session');
  const router = inject(Router);

  if (token !== null) {
    const decodedToken = getDecodedAccessToken(token);
    if ('email' in decodedToken.user) {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  }
  return false;
}
