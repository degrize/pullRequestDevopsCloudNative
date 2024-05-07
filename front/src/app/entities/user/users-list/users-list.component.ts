import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IUser} from "../user.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MsgErrorSuccessComponent} from "../../../components/msg-error-success/msg-error-success.component";
import {ModalDeleteComponent} from "../../../components/modal-delete/modal-delete.component";
import {ModalDeleteService} from "../../../components/modal-delete/modal-delete.service";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    RouterLink,
    UpperCasePipe,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    HttpClientModule,
    RouterLinkActive,
    RouterLink,
    MsgErrorSuccessComponent,
    ModalDeleteComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  currentUser!: IUser;
  users: IUser[] = [];

  usersSearched: IUser[] = [];
  searchQuery: string = "";
  searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private modalDeleteService: ModalDeleteService
  ) {
  }

  async ngOnInit() {
    this.currentUser = await this.userService.getCurrentUser()

    this.loadPage();
  }

  loadPage(): void {
    this.userService.getAll()
      .then(response => {
        this.users = response.data;
        this.usersSearched = [...this.users];
      });

    this.searchFormGroup.get("search")?.valueChanges?.subscribe(res => {
      this.searchQuery = res;
      if (this.searchQuery === "") {
        this.usersSearched = [...this.users];
      }
    });
  }

  search = (event: SubmitEvent): void => {
    event.preventDefault();
    if (this.searchQuery === "") {
      return;
    }
    this.usersSearched = this.users.filter((user: IUser) => user.firstname!.toLowerCase().includes(this.searchQuery.toLowerCase()) || user.lastname!.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

}

