import {Injectable} from '@angular/core';
import {AssociationService} from "../../../../association/service/association.service";
import {AssociationDTO} from "../../../../association/association.model";

@Injectable({
  providedIn: 'root'
})
export class ModalMoreDetailsService {
  associationsCollection: AssociationDTO[] = [];
  associationsCollectionCopie: AssociationDTO[] = [];
  tabId: any[] =  [];

  constructor(private associationService: AssociationService) {
    this.getAssociation()
  }

  getAssociation(): void {
    this.associationService.getAll()
      .then(r => {
        this.associationsCollection = Object(r);
        this.associationsCollectionCopie = Object(r);
      })
  }

  associationAlreadyChoose(id: any): void {
    if (id) {
      this.tabId.push(id);
    }
    this.associationsCollection = this.associationsCollectionCopie
      ?.filter((asso: AssociationDTO) => {
        for (let i = 0; i<this.tabId.length; i++) {
          if (asso.id == this.tabId[i]) {
            return false
          }
        }
        return true;
      });
  }

  deleteItemTabId(id: any): void {
    this.tabId.splice(this.tabId.indexOf(id), 1);
    this.associationAlreadyChoose(null);
  }







}
