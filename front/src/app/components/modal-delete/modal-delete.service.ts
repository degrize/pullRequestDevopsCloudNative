import {Injectable} from '@angular/core';
import {IModalDeleteModel} from "./modal-delete.model";

@Injectable({
  providedIn: 'root'
})
export class ModalDeleteService {
  private modalDeleteModel: IModalDeleteModel | null = null;

  constructor() { }

  setModalDeleteModel(value: IModalDeleteModel): void {
    this.modalDeleteModel = value;
  }

  getModalDeleteModel() : IModalDeleteModel {
    return <IModalDeleteModel>this.modalDeleteModel;
  }
}
