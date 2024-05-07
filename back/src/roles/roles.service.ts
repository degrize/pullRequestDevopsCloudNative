import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./role.entity";
import { DeleteResult, Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { AssociationsService } from "src/associations/associations.service";
import { User } from "src/users/user.entity";
import { Association } from "src/associations/association.entity";

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => AssociationsService))
    private associationsService: AssociationsService
  ) {
  }

  async getAll(): Promise<Role[]> {
    return await this.repository.find();
  }

  async getById(userId: number, associationId: number): Promise<Role> {
    return await this.repository.findOneBy({ userId: userId, associationId: associationId });
  }

  async create(userId: number, associationId: number, name: string): Promise<Role> {
    const newRole = this.repository.create({
      userId: userId,
      associationId: associationId,
      name: name
    });

    return await this.repository.save(newRole);
  }

  async updateById(userId: number, associationId: number, name: string): Promise<Role> {
    const role = await this.getById(userId, associationId);
    if (!role) {
      return null;
    }
    role.name = name !== undefined ? name : role.name;
    return await this.repository.save(role);
  }

  async deleteById(userId: number, associationId: number): Promise<boolean> {
    const user: User = await this.usersService.getById(userId);
    const association: Association = await this.associationsService.getById(associationId);
    const result: DeleteResult = await this.repository.delete({ user: user, association: association });
    return result.affected !== 0;
  }
}
