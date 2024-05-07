import {Routes} from '@angular/router';
import {UsersListComponent} from "./entities/user/users-list/users-list.component";
import {LoginComponent} from "./account/login/login.component";
import {authGuardLoggedIn, authGuardNotLoggedIn} from "./core/guards/auth.guard";
import {AssociationsListComponent} from "./entities/association/associations-list/associations-list.component";
import {ProfilComponent} from "./account/profil/profil.component";
import {AssociationsDetailComponent} from "./entities/association/associations-detail/associations-detail.component";
import {UsersUpdateComponent} from "./entities/user/users-update/users-update.component";
import {UsersDetailComponent} from "./entities/user/users-detail/users-detail.component";
import {RegisterComponent} from "./account/register/register.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {path: 'users', component: UsersListComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'users/new', component: UsersUpdateComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'users/detail/:id', component: UsersDetailComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'associations', component: AssociationsListComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'associations/detail/:id', component: AssociationsDetailComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'profil', component: ProfilComponent, canActivate: [authGuardNotLoggedIn]},
  {path: 'login', component: LoginComponent, canActivate: [authGuardLoggedIn]},
  {path: 'register', component: RegisterComponent, canActivate: [authGuardLoggedIn]},
  {path: '', component: HomeComponent}
];
