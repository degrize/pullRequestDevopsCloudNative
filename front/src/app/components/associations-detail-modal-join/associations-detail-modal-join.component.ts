import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Modal, ModalInterface} from "flowbite";
import {AssociationDTO} from "../../entities/association/association.model";
import {IUser} from "../../entities/user/user.model";
import {AssociationService} from "../../entities/association/service/association.service";

@Component({
  selector: 'app-associations-detail-modal-join',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './associations-detail-modal-join.component.html',
  styleUrl: './associations-detail-modal-join.component.css'
})
export class AssociationsDetailModalJoinComponent implements OnInit {

  @ViewChild('joinAssociationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;
  @Input()
  currentUser!: IUser;
  @Input()
  isCurrentUserMember: boolean = false;

  joinFormGroup: FormGroup = new FormGroup({});
  errorMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
  ) {
  }

  ngOnInit() {
  }

  async join(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.currentUser || this.isCurrentUserMember) {
      return;
    }

    this.errorMessage = "";
    await this.associationService.join(this.association.id, this.currentUser.id!);

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
    this.errorMessage = "";
    this.modal.show();
  }

  closeModal(): void {
    !this.modal && this.initModal();
    this.modal.hide();
  }
}
