import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../core/auth/token-storage.service";
import {CommonModule, NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  isLogged: boolean = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    initFlowbite();
    this.tokenStorageService.getIsLoggedInObservable().subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
    });
  }

  isAuthenticated(): boolean {
    return this.tokenStorageService.isLogged();
  }

  logout = (): void => {
    this.tokenStorageService.clear();
    this.router.navigateByUrl("/login");
  }
}
