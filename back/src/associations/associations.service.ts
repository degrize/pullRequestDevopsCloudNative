import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Association } from "./association.entity";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Member } from "./association.member";
import { Role } from "src/roles/role.entity";
import { RolesService } from "src/roles/roles.service";
import { AssociationDTO } from "./association.dto";
import { Minute } from "src/minutes/minute.entity";
import { MinutesService } from "src/minutes/minutes.service";
import { MinuteDTO } from "src/minutes/minute.dto";

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private repository: Repository<Association>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
    @Inject(forwardRef(() => MinutesService))
    private minutesService: MinutesService
  ) {
  }

  async getAll(): Promise<Association[]> {
    return await this.repository.find();
  }

  async getById(id: number): Promise<Association> {
    return await this.repository.findOneBy({ id: id });
  }

  async getMembers(id: number): Promise<User[]> {
    const association = await this.getById(id);
    return association.users;
  }

  async create(idUsers: number[], name: string): Promise<Association> {
    const users: User[] = (await this.usersService.getAll()).filter((user: User) => idUsers && idUsers.includes(user.id));
    const createAssociation = this.repository.create({
      name: name,
      users: users
    });

    const newAssociation: Association = await this.repository.save(createAssociation);

    // Ajoute le rôle de président aux créateurs de l'association
    idUsers.forEach(async (id: number) => {
      const newRole: Role = await this.rolesService.create(id, newAssociation.id, "Président");
    });

    // Créer une minute
    const currentDate: string = new Date().toLocaleDateString();
    const newMinute: Minute = await this.minutesService.create(currentDate, "Création de l'association.", idUsers, newAssociation.id);

    return newAssociation;
  }

  async updateById(id: number, idUsers: number[], name: string): Promise<Association> {
    const association = await this.getById(id);
    const users: User[] = (await this.usersService.getAll()).filter((user: User) => idUsers && idUsers.includes(user.id));

    association.name = name !== undefined ? name : association.name;
    association.users = idUsers ? users : association.users;
    return await this.repository.save(association);
  }

  async deleteById(id: number): Promise<boolean> {
    const association: AssociationDTO = await this.getByIdDto(id);

    association.minutes.forEach(async (minute: MinuteDTO) => {
      await this.minutesService.deleteById(minute.id);
    });

    association.members.forEach(async (member: Member) => {
      await this.rolesService.deleteById(member.id, association.id);
    });

    await this.updateById(id, [], association.name);

    const result: DeleteResult = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async joinById(id: number, userId: number): Promise<Association> {
    const association = await this.getById(id);
    const newMember = await this.usersService.getById(userId);
    association.users.push(newMember);

    const newRole: Role = await this.rolesService.create(userId, id, "Membre");

    return await this.repository.save(association);
  }

  async leaveById(id: number, userId: number): Promise<Association> {
    const associationDto: AssociationDTO = await this.getByIdDto(id);

    // Retire le vote de l'utilisateur courant aux minutes
    associationDto.minutes.forEach((minute: MinuteDTO) => {
      if (minute.voters.includes(userId)) {
        const newVoters: number[] = minute.voters.filter((voterId: number) => voterId !== userId);
        this.minutesService.updateById(minute.id, minute.date, minute.content, newVoters, associationDto.id);
      }
    });

    // Supprime le rôle de l'utilisateur
    const oldRole: boolean = await this.rolesService.deleteById(userId, id);

    // Supprime l'utilisateur de l'association
    const association: Association = await this.getById(id);
    association.users = association.users.filter((user: User) => user.id !== userId);

    return await this.repository.save(association);
  }

  async sendNotification(associationId: number, userId: number, message: string): Promise<boolean> {
    const association: AssociationDTO = await this.getByIdDto(associationId);
    const userSender: User = await this.usersService.getById(userId);
    const usersReceiver: Member[] = association.members.filter((member: Member) => member.id !== userId);

    const sender = {
      firstname: userSender.firstname,
      lastname: userSender.lastname,
      email: userSender.email,
    }

    const receivers = usersReceiver.map((member: Member) => {
      return {
        firstname: member.firstName,
        lastname: member.name,
        email: member.email,
      }
    })

    const amqp = require('amqplib/callback_api');

    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        const queue: string = 'fr-administration-mq';
        channel.assertQueue(queue, {
          durable: false
        });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
          sender: sender,
          receivers: receivers,
          message: message,
        })));
        console.log(" [x] Sent '%s'", message);
      });

      setTimeout(function () {
        connection.close();
        console.log("Connexion close");
        //process.exit(0)
      }, 500);
    });

    return true;
  }

  // ----- DTO -----

  async createMember(user: User, idAssociation: number): Promise<Member> {
    const role: Role = await this.rolesService.getById(user.id, idAssociation);
    return new Member(user.id, user.lastname, user.firstname, user.email, user.age, role.name);
  }

  async createAssociationDto(association: Association): Promise<AssociationDTO> {
    const members: Member[] = await Promise.all(association.users.map(async (user: User) => await this.createMember(user, +association.id)));
    const minutes: Minute[] = (await this.minutesService.getAll()).filter((minute: Minute) => minute.association.id === association.id);
    const minutesDTO: MinuteDTO[] = minutes.map((minute: Minute) => {
      const voters: number[] = minute.voters.map((user: User) => user.id);
      return new MinuteDTO(minute.id, minute.date, minute.content, voters);
    });
    return new AssociationDTO(association.id, association.name, members, minutesDTO);
  }

  async getAllDto(): Promise<AssociationDTO[]> {
    const associations: Association[] = await this.getAll();
    return await Promise.all(associations.map(async (association: Association) => await this.createAssociationDto(association)));
  }

  async getByIdDto(id: number): Promise<AssociationDTO> {
    const association: Association = await this.getById(id);
    return await this.createAssociationDto(association);
  }

  async getMembersDto(id: number): Promise<Member[]> {
    const associationDTO: AssociationDTO = await this.getByIdDto(id);
    return associationDTO.members;
  }
}
