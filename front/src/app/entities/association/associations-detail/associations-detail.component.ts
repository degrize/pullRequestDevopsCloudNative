import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {lastValueFrom, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {AssociationDTO, Member} from "../association.model";
import {IUser} from "../../user/user.model";
import {UserService} from "../../user/service/user.service";
import {ReactiveFormsModule} from "@angular/forms";
import {ModalDeleteComponent} from "../../../components/modal-delete/modal-delete.component";
import {
  AssociationsDetailModalJoinComponent
} from "../../../components/associations-detail-modal-join/associations-detail-modal-join.component";
import {
  AssociationsDetailModalLeaveComponent
} from "../../../components/associations-detail-modal-leave/associations-detail-modal-leave.component";
import {
  AssociationsDetailModalGererMembersComponent
} from "../../../components/associations-detail-modal-gerer-members/associations-detail-modal-gerer-members.component";
import {
  AssociationsDetailModalUpdateComponent
} from "../../../components/associations-detail-modal-update/associations-detail-modal-update.component";
import {
  AssociationsDetailModalMinuteCreateComponent
} from "../../../components/associations-detail-modal-minute-create/associations-detail-modal-minute-create.component";
import {
  AssociationsDetailModalNotificationComponent
} from "../../../components/associations-detail-modal-notification/associations-detail-modal-notification.component";

@Component({
  selector: 'app-associations-detail',
  standalone: true,
  imports: [
    NgIf,
    TitleCasePipe,
    UpperCasePipe,
    NgForOf,
    ReactiveFormsModule,
    ModalDeleteComponent,
    AssociationsDetailModalJoinComponent,
    AssociationsDetailModalLeaveComponent,
    AssociationsDetailModalGererMembersComponent,
    AssociationsDetailModalUpdateComponent,
    AssociationsDetailModalMinuteCreateComponent,
    AssociationsDetailModalNotificationComponent
  ],
  templateUrl: './associations-detail.component.html',
  styleUrl: './associations-detail.component.css'
})
export class AssociationsDetailComponent implements OnInit {
  id: number = -1;
  association!: AssociationDTO;
  currentUser!: IUser;
  isCurrentUserMember: boolean = false;
  isCurrentUserPresident: boolean = false;

  modifiedUser!: Member;
  open: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private userService: UserService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = Number(paramMap.get("id"));
      if (!this.id || this.id < 0) {
        this.redirectToAssociations();
      }
    });

    this.currentUser = await this.userService.getCurrentUser();
    this.loadPage();
  }

  loadPage(): void {
    const request: Observable<any> = this.http.get(`http://localhost:3000/associations/${this.id}`, {observe: 'response'});
    lastValueFrom(request)
      .then(response => {
        this.association = response.body;
        this.setIsCurrentUserMember();
        this.setIsCurrentUserPresident();
        if (this.association.members.length > 0) {
          this.modifiedUser = this.association.members[0];
        }
      })
      .catch(error => this.redirectToAssociations());
  }

  redirectToAssociations(): void {
    this.router.navigateByUrl("/associations");
  }

  setIsCurrentUserMember(): void {
    const isMember: Member[] = this.association.members.filter((member: Member) => member.id === this.currentUser.id);
    this.isCurrentUserMember = isMember.length > 0;
  }

  setIsCurrentUserPresident(): void {
    const presidents: Member[] = this.association.members.filter((member: Member) => member.role.toLocaleLowerCase() === "président");
    const isPresident: Member[] = presidents.filter((president: Member) => president.id === this.currentUser.id);
    this.isCurrentUserPresident = isPresident.length > 0;
  }

  reloadPage(doIt: boolean): void {
    doIt && this.loadPage();
  }

  navigateToUserDetail(userId: number): void {
    this.router.navigateByUrl(`/users/detail/${userId}`);
  }

  updateModifiedUser(newModifiedUser: Member): void {
    this.modifiedUser = newModifiedUser;
    this.setOpen(true);
  }

  setOpen(value: boolean): void {
    this.open = value;
  }
}
