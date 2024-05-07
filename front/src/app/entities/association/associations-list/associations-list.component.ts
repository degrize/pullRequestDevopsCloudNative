import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AssociationDTO} from "../association.model";
import {MsgErrorSuccessComponent} from "../../../components/msg-error-success/msg-error-success.component";
import {ModalDeleteComponent} from "../../../components/modal-delete/modal-delete.component";
import {UserService} from "../../user/service/user.service";
import {IUser} from "../../user/user.model";
import {
  AssociationsListModalCreateComponent
} from "../../../components/associations-list-modal-create/associations-list-modal-create.component";

@Component({
  selector: 'app-associations-list',
  standalone: true,
  imports: [
    NgForOf,
    UpperCasePipe,
    TitleCasePipe,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    RouterLink,
    MsgErrorSuccessComponent,
    ModalDeleteComponent,
    AssociationsListModalCreateComponent
  ],
  templateUrl: './associations-list.component.html',
  styleUrl: './associations-list.component.css'
})
export class AssociationsListComponent {
  currentUser!: IUser;
  associations: AssociationDTO[] = [];

  associationsSearched: AssociationDTO[] = [];
  searchQuery: string = "";
  searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    this.searchFormGroup.get("search")?.valueChanges?.subscribe(res => {
      this.searchQuery = res;
      if (this.searchQuery === "") {
        this.associationsSearched = [...this.associations];
      }
    });

    this.currentUser = await this.userService.getCurrentUser();
    this.loadPage();
  }

  loadPage(): void {
    const request: Observable<any> = this.http.get('http://localhost:3000/associations', {observe: 'response'});
    lastValueFrom(request).then(response => {
      this.associations = response.body;
      this.associationsSearched = [...this.associations];
    });
  }

  navigateToAssociation(associationId: number): void {
    this.router.navigateByUrl('/associations/detail/' + associationId);
  }

  search = (event: SubmitEvent): void => {
    event.preventDefault();
    if (this.searchQuery === "") {
      return;
    }

    this.associationsSearched = this.associations.filter((association: AssociationDTO) => association.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  reloadPage(doIt: boolean): void {
    doIt && this.loadPage();
  }
}

