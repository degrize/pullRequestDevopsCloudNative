import {CanActivateFn, Router} from '@angular/router';
import {TokenStorageService} from "../auth/token-storage.service";
import {inject} from "@angular/core";

export const authGuardNotLoggedIn: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const service = inject(TokenStorageService)

  if (service.isLogged()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};

export const authGuardLoggedIn: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const service = inject(TokenStorageService)

  if (!service.isLogged()) {
    return true;
  }

  router.navigateByUrl('/');
  return false;
};
