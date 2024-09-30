import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (localStorage.getItem('token') != null) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
