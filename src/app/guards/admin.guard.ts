import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { getDecodedAccessToken } from '../utils/tokenValidations';

export function adminGuard() {
  const router = inject(Router);
  const loginService = inject(LoginService);
  var res: boolean = false;
  const token = sessionStorage.getItem('token_session');

  if (token !== null) {
    const decodedToken = getDecodedAccessToken(token);
    return 'username' in decodedToken.user;
  }
  return false;
  // loginService.isAdmin().subscribe({
  //   next: (data: boolean) => {
  //     console.log('hola', data);
  //     res = data;
  //     return res;
  //   },
  //   error: (err) => {
  //     console.log(err);
  //     res = false;
  //     return res;
  //   },
  // });
}
