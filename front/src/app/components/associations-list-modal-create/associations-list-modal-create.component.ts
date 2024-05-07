import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Modal, ModalInterface} from "flowbite";
import {IUser} from "../../entities/user/user.model";
import {AssociationService} from "../../entities/association/service/association.service";

@Component({
  selector: 'app-associations-list-modal-create',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './associations-list-modal-create.component.html',
  styleUrl: './associations-list-modal-create.component.css'
})
export class AssociationsListModalCreateComponent implements OnInit {

  @ViewChild('createAssociationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  currentUser!: IUser;

  associationName: string = "";
  errorMessage: string = "";
  createFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
  ) {
  }

  ngOnInit() {
    this.createFormGroup.get("name")?.valueChanges?.subscribe(res => {
      this.associationName = res;
    });
  }

  async create(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.currentUser) {
      return;
    }

    if (this.associationName === "") {
      this.errorMessage = "Veuillez entrer un nom d'association.";
      return;
    }

    this.errorMessage = "";
    await this.associationService.create(this.associationName, [this.currentUser.id!]);

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
