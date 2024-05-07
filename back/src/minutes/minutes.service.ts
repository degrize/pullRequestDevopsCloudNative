import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Minute } from "./minute.entity";
import { AssociationsService } from "src/associations/associations.service";
import { Association } from "src/associations/association.entity";

@Injectable()
export class MinutesService {

  constructor(
    @InjectRepository(Minute)
    private repository: Repository<Minute>,
    @Inject(forwardRef(() => AssociationsService))
    private associationsService: AssociationsService
  ) {
  };

  async getAll(): Promise<Minute[]> {
    return await this.repository.find();
  }

  async getById(id: number): Promise<Minute> {
    return await this.repository.findOneBy({ id: id });
  }

  async getVoters(id: number): Promise<User[]> {
    const association = await this.getById(id);
    if (!association) {
      return null;
    }

    return association.voters;
  }

  async create(date: string, content: string, idVoters: number[], associationId: number): Promise<Minute> {
    const association = await this.associationsService.getById(associationId);
    if (!association) {
      return null;
    }

    const voters: User[] = association.users.filter((user: User) => idVoters && idVoters.includes(user.id));
    const newMinute = this.repository.create({
      date: date,
      content: content,
      voters: voters,
      association: association
    });

    return await this.repository.save(newMinute);
  }

  async updateById(id: number, date: string, content: string, idVoters: number[], associationId: number): Promise<Minute> {
    const minute: Minute = await this.getById(id);
    if (!minute) {
      return null;
    }

    const association: Association = await this.associationsService.getById(associationId) || minute.association;

    // Pour éviter que des users qui ne font plus partis de l'association soit encore considérés comme voteurs.
    const oldVotersId: number[] = minute.voters.map((user: User) => user.id);
    const voters: User[] = association.users.filter((user: User) => idVoters ? idVoters.includes(user.id) : oldVotersId.includes(user.id));

    minute.date = date !== undefined ? date : minute.date;
    minute.content = content !== undefined ? content : minute.content;
    minute.association = association;
    minute.voters = voters;
    return await this.repository.save(minute);
  }

  async deleteById(id: number): Promise<boolean> {
    const result: DeleteResult = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
