import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IUser, User} from "../user.model";
import {UserService} from "../service/user.service";
import {MsgErrorSuccessComponent} from "../../../components/msg-error-success/msg-error-success.component";
import {Router, RouterLink} from "@angular/router";
import {initFlowbite} from "flowbite";
import {NgForOf, NgIf} from "@angular/common";
import {IAssociation} from "../../association/association.model";
import {ModalMoreDetailsComponent} from "./modal-more-details/modal-more-details.component";
import {IRole} from "../../role/role.model";
import {RoleService} from "../../role/service/role.service";

@Component({
  selector: 'app-users-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MsgErrorSuccessComponent,
    RouterLink,
    NgForOf,
    ModalMoreDetailsComponent,
    NgIf,
  ],
  templateUrl: './users-update.component.html',
  styleUrl: './users-update.component.css'
})
export class UsersUpdateComponent implements OnInit {

  isSaving = true;
  associations: IAssociation[] = [];
  roles: IRole[] = [];
  doNotMatch = false;

  editForm = this.fb.group({
    id: [],
    firstname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    email: [null, [Validators.required]],
    age: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    passwordConfirm: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    associations: [],
    roles: [],
  });


  constructor(
    protected fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    //private modalMoreDetailsService: ModalMoreDetailsService,
  ) {
  }

  ngOnInit(): void {
    initFlowbite();
  }

  save(): void {
    this.isSaving = true;
    this.doNotMatch = false;
    const user = this.createFromForm();
    if (user.age && (user?.age < 18 || user?.age > 150)) {
      console.log("L'age doît être compris entre 18 et 150 ans");
      return;
    }
    const password = this.editForm.get(['password'])!.value;
    if (password !== this.editForm.get(['passwordConfirm'])!.value) {
      this.doNotMatch = true;
    } else {
      this.userService.create(user)
        .then(res => {
          if (res) { // On crée le role apres que le User a été créé
            this.router.navigateByUrl("/login");
            return;
          }
        })
    }
  }

  /*getFromMoreDetail(value: any) {
    let canAdd = true;
    this.associationDetailComponentList.forEach((el: any)=> {
      if (value.association.id == el.association.id) {
        canAdd = false;
        return;
      }
    })
    if (canAdd) {

      this.associationDetailComponentList.push(value);
    } else {
      alert("Element existe deja, vous pouvez le supprimer")
    }
  }

  deleteMoreDetailItem(associationId: any) {
    this.associationDetailComponentList = this.associationDetailComponentList
      .filter((value: any) => value.association.id != associationId);

    this.modalMoreDetailsService.deleteItemTabId(associationId)
  }
*/
  protected createFromForm(): IUser {
    return {
      ...new User(),
      id: this.editForm.get(['id'])!.value,
      lastname: this.editForm.get(['lastname'])!.value?.toString().trim(),
      firstname: this.editForm.get(['firstname'])!.value?.toString().trim(),
      email: this.editForm.get(['email'])!.value?.toString().trim(),
      age: this.editForm.get(['age'])!.value,
      password: this.editForm.get(['password'])!.value?.toString(),
    };
  }

}
