export interface IRole {
  idUser?: number | null;
  idAssociation?: number | null;
  name?: string;
}

export class Role implements IRole {
  constructor(
    idUser?: number | null,
    idAssociation?: number | null,
  ) {
  }
}
