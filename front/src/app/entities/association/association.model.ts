export interface IAssociation {
  id: number;
  name?: string;
  members?: Member[];
  minutes?: Minute[];
}

export class AssociationDTO implements IAssociation {
  constructor(
    public id: number,
    public name: string,
    public members: Member[],
    public minutes: Minute[],
  ) {}
}

export class Member {
  constructor(
    public id: number,
    public age: number,
    public firstName: string,
    public name: string,
    public email: string,
    public role: string,
  ) {
  }
}

export class Minute {
  constructor(
    public id: number,
    public date: string,
    public content: string,
    public voters: number[]
  ) {
  }
}
