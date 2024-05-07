import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {Modal, ModalInterface} from "flowbite";
import {AssociationDTO} from "../../entities/association/association.model";
import {MinuteService} from "../../entities/minute/service/minute.service";

@Component({
  selector: 'app-associations-detail-modal-minute-create',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe,
    NgForOf
  ],
  templateUrl: './associations-detail-modal-minute-create.component.html',
  styleUrl: './associations-detail-modal-minute-create.component.css'
})
export class AssociationsDetailModalMinuteCreateComponent implements OnInit {

  @ViewChild('createMinuteModal') modalDom!: ElementRef<HTMLElement>;
  modal!: ModalInterface;

  @Input()
  association!: AssociationDTO;

  content: string = "";
  voters: number[] = [];
  createFormGroup: FormGroup = new FormGroup({
    content: new FormControl('', [Validators.required]),
    voters: new FormControl([], [Validators.required]),
  });

  errorMessage: string = "";
  warningMessage: string = "";

  @Output()
  reloadEvent = new EventEmitter<boolean>();

  constructor(
    private minuteService: MinuteService,
  ) {
  }

  ngOnInit() {
    this.createFormGroup.get("content")?.valueChanges?.subscribe(res => {
      this.content = res;
    });

    this.createFormGroup.get("voters")?.valueChanges?.subscribe(res => {
      this.voters = res;
    });
  }

  async create(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (!this.association) {
      return;
    }

    if (!this.content || this.voters.length <= 0) {
      this.errorMessage = "Tous les champs doivent être complétés.";
      return;
    }

    const date: string = new Date().toLocaleDateString();
    await this.minuteService.create(this.content, date, this.association.id, this.voters)

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
