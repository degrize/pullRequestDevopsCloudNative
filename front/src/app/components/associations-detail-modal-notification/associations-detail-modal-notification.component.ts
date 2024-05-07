import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {Modal, ModalInterface} from "flowbite";
import {AssociationDTO} from "../../entities/association/association.model";
import {AssociationService} from "../../entities/association/service/association.service";
import { IUser } from '../../entities/user/user.model';

@Component({
  selector: 'app-associations-detail-modal-notification',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe
  ],
  templateUrl: './associations-detail-modal-notification.component.html',
  styleUrl: './associations-detail-modal-notification.component.css'
})
export class AssociationsDetailModalNotificationComponent implements OnInit {

  @ViewChild('notificationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;
  @Input()
  currentUser!: IUser;

  message: string = "";
  createFormGroup: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  errorMessage: string = "";
  warningMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
  ) {
  }

  ngOnInit() {
    this.createFormGroup.get("message")?.valueChanges?.subscribe(res => {
      this.message = res;
    });
  }

  async sendNotification(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (!this.association || !this.currentUser) {
      return;
    }

    if (!this.message) {
      this.errorMessage = "Tous les champs doivent être complétés.";
      return;
    }

    await this.associationService.pushNotification(this.association.id, this.currentUser.id!, this.message);

    this.closeModal();
    this.reloadEvent.emit(true);
  }


  initModal(): void {
    if (!this.modal) {
      this.modal = new Modal(this.modalDom.nativeElement, {closable: false});
    }
  }

  openModal(): void {
    !this.modal && this.initModal();
    this.errorMessage = "";
    this.warningMessage = "";
    this.modal.show();
  }

  closeModal(): void {
    !this.modal && this.initModal();
    this.modal.hide();
  }
}
