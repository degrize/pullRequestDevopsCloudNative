import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { Role } from "./role.entity";
import { RoleParamsIds } from "./role.params";
import { RoleInput, RoleInputName } from "./role.inputs";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("roles")
@Controller("roles")
@UseGuards(AuthGuard("jwt"))
export class RolesController {

  constructor(private service: RolesService) {
  }

  @Get()
  @ApiOkResponse({
    description: "All the roles of the database."
  })
  async getAll(): Promise<Role[]> {
    return await this.service.getAll();
  }

  @Get(":idUser/:idAssociation")
  @ApiOkResponse({
    description: "The role being searched for."
  })
  @ApiNotFoundResponse({
    description: "No role for the specified ID."
  })
  async getById(@Param() parameter: RoleParamsIds): Promise<Role> {
    const role = await this.service.getById(+parameter.idUser, +parameter.idAssociation);
    if (!role) {
      throw new HttpException("No role for the specified IDs.", 404);
    }

    return role;
  }

  @Post()
  @ApiOkResponse({
    description: "The role has been successfully created."
  })
  @ApiNotFoundResponse({
    description: "All attributes must be defined."
  })
  async create(@Body() input: RoleInput): Promise<Role> {
    if (input.idUser === undefined || input.idAssociation === undefined || input.name === undefined) {
      throw new HttpException("All attributes must be defined.", 404);
    }

    return await this.service.create(+input.idUser, +input.idAssociation, input.name);
  }

  @Put(":idUser/:idAssociation")
  @ApiOkResponse({
    description: "The role has been successfully updated."
  })
  @ApiNotFoundResponse({
    description: "No role for the specified IDs."
  })
  async updateById(@Param() parameter: RoleParamsIds, @Body() input: RoleInputName): Promise<Role> {
    const updatedRole = await this.service.updateById(+parameter.idUser, +parameter.idAssociation, input.name);
    if (!updatedRole) {
      throw new HttpException("No role for the specified IDs.", 404);
    }

    return updatedRole;
  }

  @Delete(":idUser/:idAssociation")
  @ApiOkResponse({
    description: "The role has been successfully deleted."
  })
  @ApiNotFoundResponse({
    description: "No role for the specified IDs."
  })
  async deleteById(@Param() parameter: RoleParamsIds): Promise<boolean> {
    const deletedAssociation = await this.service.deleteById(+parameter.idUser, +parameter.idAssociation);
    if (!deletedAssociation) {
      throw new HttpException("No role for the specified IDs.", 404);
    }

    return deletedAssociation;
  }
}
