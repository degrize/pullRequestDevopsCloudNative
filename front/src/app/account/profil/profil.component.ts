import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiHelperService} from "../../core/auth/api-helper.service";
import {TokenStorageService} from "../../core/auth/token-storage.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../entities/user/service/user.service";
import {NgIf} from "@angular/common";
import {PasswordModalComponent} from "../../components/password-modal/password-modal.component";
import {IUser} from "../../entities/user/user.model";
import {MsgErrorSuccessComponent} from "../../components/msg-error-success/msg-error-success.component";
import {ModalDeleteComponent} from "../../components/modal-delete/modal-delete.component";
import {ModalDeleteService} from "../../components/modal-delete/modal-delete.service";

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    PasswordModalComponent,
    MsgErrorSuccessComponent,
    ModalDeleteComponent
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: IUser | null = null;
  username: string = "";
  currentPassword: string = "";
  lastname: string = "";
  firstname: string = "";
  age: number = 18;

  newPassword: string = "";
  confirmNewPassword: string = "";

  errorMessage: string = "";
  successToast: boolean = false;
  doNotMatch = false;


  personInfoFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
  });

  editPasswordFormGroup: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    currentPassword: new FormControl('',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    confirmNewPassword: new FormControl('',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
  });

  constructor(
    private api: ApiHelperService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private modalDeleteService: ModalDeleteService
  ) {
  }

  async ngOnInit() {
    this.user = await this.userService.getCurrentUser();
    this.updateProfile(this.user);
    if (this.user) {
      this.firstname = this.user?.firstname ? this.user.firstname : "";
      this.lastname = this.user?.lastname ? this.user.lastname : "";
      this.age = this.user?.age ? this.user.age : 18;
    }

    this.bindFormControl();
  }

  bindFormControl(): void {
    this.personInfoFormGroup.get("username")?.valueChanges?.subscribe(res => {
      this.username = res;
    });

    this.personInfoFormGroup.get("firstname")?.valueChanges?.subscribe(res => {
      this.firstname = res;
    });
    this.personInfoFormGroup.get("lastname")?.valueChanges?.subscribe(res => {
      this.lastname = res;
    });
    this.personInfoFormGroup.get("age")?.valueChanges?.subscribe(res => {
      this.age = res;
    });

    this.editPasswordFormGroup.get("newPassword")?.valueChanges?.subscribe(res => {
      this.newPassword = res;
    });
    this.editPasswordFormGroup.get("confirmNewPassword")?.valueChanges?.subscribe(res => {
      this.confirmNewPassword = res;
    });
    this.editPasswordFormGroup.get("currentPassword")?.valueChanges?.subscribe(res => {
      this.currentPassword = res;
    });
  }

  updateProfile(user: IUser | null) {
    this.personInfoFormGroup.patchValue({
      lastname: user?.lastname,
      firstname: user?.firstname,
      age: user?.age,
      username: user?.id,
    });
  }

  savePersonInfo = (): void => {
    if(!this.firstname || !this.lastname || !this.age){
      this.errorMessage = "Tous les champs doivent être remplis.";
      this.successToast = false;
      return;
    }

    if (this.age < 18 || this.age > 150) {
      this.errorMessage = "L'âge doit être compris entre 18 et 150 ans.";
      this.successToast = false;
      return;
    }

    this.api.put({
      endpoint: `/users/${this.user?.id}`,
      data: {
        id: this.username,
        firstname: this.firstname,
        lastname: this.lastname,
        age: this.age,
        password: this.currentPassword
      }
    })
      .then(response => {
        //alert("Utilisateur Modifié avec Succès");
        this.successToast = true;
        this.errorMessage = "Votre compte a bien été modifié";
      }).catch(() => {
      this.errorMessage = "Invalid username and/or password.";
      this.successToast = false;
    });
  }

  savePassword = (): void => {
    if (this.confirmNewPassword === this.newPassword) {
      this.api.put({
        endpoint: `/users/${this.user?.id}/change-password`,
        data: {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        }
      })
        .then(response => {
          //alert("Utilisateur Modifié avec Succès");
          this.successToast = true;
          this.errorMessage = "your password has been updated well";
        }).catch(() => {
        this.errorMessage = "Invalid password and/or new password.";
        this.successToast = false;
      });
    } else {
      this.errorMessage = "Write the same password please about confirm and new password";
      this.successToast = false;
    }
  }

  setPassword(value: string): void {
    this.currentPassword = value;
  }


  openModal(id: number | undefined, event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.modalDeleteService.setModalDeleteModel({
      id: id,
    })

  }

  delete(id: any) {
    this.userService.delete(Number(id))
      .then(res => {

      })
  }

}
