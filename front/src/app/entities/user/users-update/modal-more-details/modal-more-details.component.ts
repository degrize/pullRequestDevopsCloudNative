import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AssociationDTO, IAssociation} from "../../../association/association.model";
import {ModalMoreDetailsService} from "./service/modal-more-details.service";
import {NgForOf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RoleService} from "../../../role/service/role.service";
import {IRole} from "../../../role/role.model";

@Component({
  selector: 'app-modal-more-details',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './modal-more-details.component.html',
  styleUrl: './modal-more-details.component.css'
})
export class ModalMoreDetailsComponent implements OnInit{

  associationsCollection: AssociationDTO[] = [];
  associations: IAssociation[] | null = [];
  rolesCollections: IRole[] | null = [];
  rolesCollectionsFilter: IRole[] | null = [];

  @Output()
  moreDetailEvent = new EventEmitter<any>()

  editForm = this.fb.group({
    association: [],
    role: [],
  });

  constructor(
    public modalMoreDetailsService: ModalMoreDetailsService,
    private roleService: RoleService,
    protected fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.roleService.getAll()
      .then(r => {
        this.rolesCollections = r.data;
      })
  }

  getAllRolesByAssociationId(value: IAssociation | null): void {
    if (this.rolesCollections && value) {
      this.rolesCollectionsFilter = this.rolesCollections.filter((role) => role?.idAssociation == value.id);
    }
  }

  save(): void {
    const moreDetail = {
      association : this.editForm.get(['association'])?.value,
      role : this.editForm.get(['role']) ? this.editForm.get(['role'])?.value : null,
    }
    if (moreDetail.association) {
      this.modalMoreDetailsService.associationAlreadyChoose(moreDetail.association.id)
      this.moreDetailEvent.emit(moreDetail);
    }
    this.rolesCollectionsFilter = [];
    this.editForm.reset();
  }

}
