import {AssociationDTO} from "../association/association.model";
import {IRole} from "../role/role.model";

export interface IUser {
  id?: number;
  password?: string;
  lastname?: string;
  firstname?: string;
  email?: string;
  age?: number;
  associations?: AssociationDTO[];
  roles?: IRole[];
}

export class User implements IUser {
  constructor(
  ) {
  }
}
