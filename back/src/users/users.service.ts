import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AssociationDTO } from "src/associations/association.dto";
import { UserDTO } from "./user.dto";
import { AssociationsService } from "src/associations/associations.service";
import { Member } from "src/associations/association.member";
import { MinutesService } from "src/minutes/minutes.service";
import { MinuteDTO } from "src/minutes/minute.dto";
import { Minute } from "src/minutes/minute.entity";

@Injectable()
export class UsersService {
  private saltOrRounds: number = 10;

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @Inject(forwardRef(() => AssociationsService))
    private associationsService: AssociationsService,
    @Inject(forwardRef(() => MinutesService))
    private minutesService: MinutesService,
  ) {
    //this.create("John", "Doe", 18, "1234");
  }

  async getAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async getById(id: number): Promise<User> {
    return await this.repository.findOneBy({ id: id });
  }

  async getByEmail(email: string): Promise<User> {
    const users: User[] = await this.getAll();
    const usersFiltered: User[] = users.filter((user: User) => user.email === email);

    return usersFiltered.length > 0 ? usersFiltered[0] : null;
  }

  async create(firstname: string, lastname: string, email: string, age: number, password: string): Promise<User> {
    const users: User[] = await this.getAll();
    const usersFiltered: User[] = users.filter((user: User) => user.email === email);
    if (usersFiltered.length > 0) {
      return null;
    }

    const newUser: User = this.repository.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      age: age,
      password: await bcrypt.hash(password, this.saltOrRounds)
    });

    return await this.repository.save(newUser);
  }

  async updatePasswordById(id: number, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }

    const isPassword: boolean = await bcrypt.compare(currentPassword, user?.password);
    if (!isPassword) {
      return null;
    }

    user.password = await bcrypt.hash(newPassword, this.saltOrRounds);
    return await this.repository.save(user);
  }

  async updateByIdWithoutPasswordChanging(id: number, firstname: string, lastname: string, email: string, age: number, password: string): Promise<User> {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }

    const isPassword: boolean = await bcrypt.compare(password, user?.password);
    if (!isPassword) {
      return null;
    }

    user.firstname = firstname !== undefined ? firstname : user.firstname;
    user.lastname = lastname !== undefined ? lastname : user.lastname;
    user.email = email !== undefined ? email : user.email;
    user.age = age !== undefined ? age : user.age;
    return await this.repository.save(user);
  }

  async deleteUserRelationshipById(id: number): Promise<boolean> {
    const user: UserDTO = await this.getByIdDto(id);

    user.associations.forEach(async (association: AssociationDTO) => {
      const presidents: Member[] = association.members.filter((member: Member) => member.role.toLocaleLowerCase() === 'président');
      const isCurrentUserPresident: boolean = presidents.filter((member: Member) => member.id === user.id).length > 0;

      // Supprime l'association si l'utilisateur courant est le seul membre
      // Ou si l'utilisateur courant est le seul président
      if (association.members.length <= 1 || (presidents.length === 1 && isCurrentUserPresident)) {
        await this.associationsService.deleteById(association.id);
      } else {
        // Sinon l'utilisateur quitte simplement l'association
        await this.associationsService.leaveById(association.id, user.id);
      }
    });
    return true;

  }

  async deleteById(id: number): Promise<boolean> {
    const result: DeleteResult = await this.repository.delete(id);
    return result.affected !== 0;
  }

  // ----- DTO -----

  async createUserDto(user: User): Promise<UserDTO> {
    const associationsDTO: AssociationDTO[] = (await this.associationsService.getAllDto()).filter((associationDTO: AssociationDTO) => associationDTO.containsMember(user.id));
    return new UserDTO(user.id, user.firstname, user.lastname, user.email, user.age, associationsDTO);
  }

  async getAllDto(): Promise<UserDTO[]> {
    const users: User[] = await this.getAll();
    return await Promise.all(users.map(async (user: User) => await this.createUserDto(user)));
  }

  async getByIdDto(id: number): Promise<UserDTO> {
    const user: User = await this.getById(id);
    return await this.createUserDto(user);
  }

  async getByEmailDto(email: string): Promise<UserDTO> {
    const user: User = await this.getByEmail(email);
    return await this.createUserDto(user);
  }
}
