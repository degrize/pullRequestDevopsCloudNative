import { Member } from "./association.member";
import { MinuteDTO } from "src/minutes/minute.dto";

export class AssociationDTO {

  constructor(
    public id: number,
    public name: string,
    public members: Member[],
    public minutes: MinuteDTO[]
  ) { }

  containsMember(id: number): boolean {
    const member: Member[] = this.members.filter((m: Member) => m.id === id);
    return member.length > 0;
  }
}