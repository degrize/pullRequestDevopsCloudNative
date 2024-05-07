import {Component, OnInit} from '@angular/core';
import {ApiHelperService} from "../../core/auth/api-helper.service";
import {HttpClientModule} from "@angular/common/http";
import {TokenStorageService} from "../../core/auth/token-storage.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {initFlowbite} from "flowbite";
import {MsgErrorSuccessComponent} from "../../components/msg-error-success/msg-error-success.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    NgIf,
    MsgErrorSuccessComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  errorMessage: string = "";

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private api: ApiHelperService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    initFlowbite();
    this.loginFormGroup.get("email")?.valueChanges?.subscribe(res => {
      this.email = res;
    });

    this.loginFormGroup.get("password")?.valueChanges?.subscribe(res => {
      this.password = res;
    });
  }

  login = (event: SubmitEvent): void => {
    event.preventDefault();
    this.tokenStorageService.clear();
    this.api.post({endpoint: '/auth/login', data: {username: this.email, password: this.password}})
      .then(response => {
        this.tokenStorageService.save(response.access_token, this.email);
        if (this.tokenStorageService.isLogged()) {
          this.errorMessage = "";
          this.router.navigateByUrl("/users");
        }
      }).catch(() => {
      this.errorMessage = "Invalid username and/or password.";
    });
  }
}
