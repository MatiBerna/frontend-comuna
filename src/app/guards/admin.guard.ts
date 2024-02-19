import { inject } from '@angular/core';
import { getDecodedAccessToken } from '../utils/tokenValidations';
import { Router } from '@angular/router';

export function adminGuard() {
  const token = sessionStorage.getItem('token_session');
  const router = inject(Router);

  if (token !== null) {
    const decodedToken = getDecodedAccessToken(token);
    if ('username' in decodedToken.user) {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  }
  return false;
}
