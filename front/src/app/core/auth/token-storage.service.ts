import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IS_LOGGED, IS_LOGGED_IN, TOKEN_KEY, USERNAME_KEY} from "../constants/Constants";


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor() {
    // Initialise le BehaviorSubject avec la valeur actuelle de isLoggedIn
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.isLogged());
  }

  public clear(): void {
    localStorage.clear();
    this.isLoggedInSubject.next(this.isLogged());
  }

  public save(token: string, username: string): void {
    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(IS_LOGGED_IN);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(IS_LOGGED_IN, IS_LOGGED);
    localStorage.setItem(USERNAME_KEY, String(username));

    this.isLoggedInSubject.next(this.isLogged());
  }

  public getToken(): string {
    const token = localStorage.getItem(TOKEN_KEY);
    return token === null ? '' : token;
  }

  public isLogged(): boolean {
    return (Boolean)(localStorage.getItem(IS_LOGGED_IN));
  }

  // Méthode pour obtenir un observable de isLoggedIn
  public getIsLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
