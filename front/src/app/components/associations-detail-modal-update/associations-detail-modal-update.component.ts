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
import {Modal, ModalInterface} from "flowbite";
import {AssociationDTO, Member} from "../../entities/association/association.model";
import {IUser} from "../../entities/user/user.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AssociationService} from "../../entities/association/service/association.service";
import {NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-associations-detail-modal-update',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe
  ],
  templateUrl: './associations-detail-modal-update.component.html',
  styleUrl: './associations-detail-modal-update.component.css'
})
export class AssociationsDetailModalUpdateComponent implements OnInit, OnChanges {

  @ViewChild('updateAssociationModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;
  @Input()
  currentUser!: IUser;

  name: string = "";
  updateFormGroup: FormGroup = new FormGroup({
    name: new FormControl('name', [Validators.required]),
  });

  deleteFormGroup: FormGroup = new FormGroup({});

  errorMessage: string = "";
  warningMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private associationService: AssociationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.updateFormGroup.get("name")?.valueChanges?.subscribe(res => {
      this.name = res;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('association') && changes['association'].currentValue) {
      this.name = changes['association'].currentValue.name;
      this.updateFormGroup.get('name')?.setValue(this.name);
    }
  }

  async update(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.association) {
      return;
    }

    if (this.name.toLocaleLowerCase() === this.association.name.toLocaleLowerCase()) {
      this.warningMessage = "Vous n'avez pas modifier le nom de l'association."
      return;
    }

    if (!this.name) {
      this.errorMessage = "Vous devez définir un nom pour votre association."
      return;
    }

    const membersId: number[] = this.association.members.map((member: Member) => member.id);
    await this.associationService.update(this.association.id, membersId, this.name);

    this.closeModal();
    this.reloadEvent.emit(true);
  }

  async delete(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (!this.association) {
      return;
    }

    await this.associationService.delete(this.association.id);

    this.closeModal();
    this.navigateToAssociations();
  }

  navigateToAssociations(): void {
    this.router.navigateByUrl("/associations");
  }

  initModal(): void {
    if (!this.modal) {
      this.modal = new Modal(this.modalDom.nativeElement);
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
