import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Modal, ModalInterface} from "flowbite";
import {AssociationService} from "../../entities/association/service/association.service";
import {AssociationDTO, Member} from "../../entities/association/association.model";
import {RoleService} from "../../entities/role/service/role.service";

@Component({
  selector: 'app-associations-detail-modal-gerer-members',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe
  ],
  templateUrl: './associations-detail-modal-gerer-members.component.html',
  styleUrl: './associations-detail-modal-gerer-members.component.css'
})
export class AssociationsDetailModalGererMembersComponent implements OnInit, OnChanges {

  @ViewChild('gererMemberAssociationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;
  @Input()
  userModified!: Member;
  @Input()
  open: boolean = false;

  role: string = "";
  updateFormGroup: FormGroup = new FormGroup({
    role: new FormControl('membre', [Validators.required]),
  });

  leaveFormGroup: FormGroup = new FormGroup({});

  errorMessage: string = "";
  warningMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();
  @Output()
  openEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
    private rolesService: RoleService,
  ) {
  }

  ngOnInit() {
    this.updateFormGroup.get("role")?.valueChanges?.subscribe(res => {
      this.role = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('userModified') && changes['userModified'].currentValue) {
      this.role = changes['userModified'].currentValue.role;
    }

    if (changes.hasOwnProperty('open') && changes['open'].currentValue) {
      if (changes['open'].currentValue === true) {
        this.openModal();
      }
    }
  }

  async updateRole(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.userModified || !this.association) {
      return;
    }

    if (this.role.toLocaleLowerCase() === this.userModified.role.toLocaleLowerCase()) {
      this.warningMessage = "Vous n'avez pas modifier le rôle de l'utilisateur."
      return;
    }

    await this.rolesService.update(this.userModified.id, this.association.id, this.role);

    this.closeModal();
    this.reloadEvent.emit(true);
  }

  async leave(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.userModified || !this.association) {
      return;
    }

    this.errorMessage = "";
    this.warningMessage = "";

    await this.associationService.leave(this.association.id, this.userModified.id!);

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
    this.openEvent.emit(false);
    this.modal.hide();
  }
}

