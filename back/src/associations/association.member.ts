import { Inject } from "@nestjs/common";
import { Role } from "src/roles/role.entity";
import { RolesService } from "src/roles/roles.service";
import { User } from "src/users/user.entity";

export class Member {
  constructor(
    public id: number,
    public name: string,
    public firstName: string,
    public email: string,
    public age: number,
    public role: string
  ) { }
}