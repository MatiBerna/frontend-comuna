import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { expirationTokenAuth } from '../utils/tokenValidations';
import { LoginService } from '../services/auth/login.service';
import { ToastService } from '../services/shared/toast/toast.service';

export const loginGuard = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const toastService = inject(ToastService);
  const token = sessionStorage.getItem('token_session');

  if (token !== null) {
    if (!expirationTokenAuth(token)) {
      return true;
    } else {
      //sessionStorage.removeItem('token_session');
      loginService.logOut();
      toastService.show('Tiempo de Sesión finalizado', {
        classname: 'bg-warning text-light',
        delay: 5000,
      });
      router.navigate(['login']);
      return false;
    }
  } else {
    loginService.logOut();
    router.navigate(['login']);
    return false;
  }
};
