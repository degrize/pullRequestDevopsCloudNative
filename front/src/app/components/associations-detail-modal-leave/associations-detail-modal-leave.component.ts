import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Modal, ModalInterface} from "flowbite";
import {AssociationDTO, Member} from "../../entities/association/association.model";
import {IUser} from "../../entities/user/user.model";
import {AssociationService} from "../../entities/association/service/association.service";

@Component({
  selector: 'app-associations-detail-modal-leave',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './associations-detail-modal-leave.component.html',
  styleUrl: './associations-detail-modal-leave.component.css'
})
export class AssociationsDetailModalLeaveComponent implements OnInit {

  @ViewChild('leaveAssociationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;
  @Input()
  currentUser!: IUser;
  @Input()
  isCurrentUserMember: boolean = false;
  @Input()
  isCurrentUserPresident: boolean = false;

  leaveFormGroup: FormGroup = new FormGroup({});
  errorMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
  ) {
  }

  ngOnInit() {
  }

  async leave(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.currentUser || !this.isCurrentUserMember) {
      return;
    }

    const presidents: Member[] = this.association.members.filter((member: Member) => member.role.toLocaleLowerCase() === "président");
    if (this.isCurrentUserPresident && presidents.length <= 1) {
      this.errorMessage = "Vous devez définir un nouveau président avant de quitter l'association.";
      return;
    }

    this.errorMessage = "";
    await this.associationService.leave(this.association.id, this.currentUser.id!)

    this.closeModal();
    this.reloadEvent.emit(true);
  }

  initModal(): void {
    if (!this.modal) {
      this.modal = new Modal(this.modalDom.nativeElement);
    }
  }

  openModal(): void {
    !this.modal && this.initModal();
    this.modal.show();
  }

  closeModal(): void {
    !this.modal && this.initModal();
    this.modal.hide();
  }
}
