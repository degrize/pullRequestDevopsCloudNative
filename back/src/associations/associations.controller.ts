import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AssociationsService } from "./associations.service";
import { Association } from "./association.entity";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AssociationParamID } from "./association.params";
import { AssociationInput, AssociationJoinInput, NotificationInput } from "./association.inputs";
import { AuthGuard } from "@nestjs/passport";
import { AssociationDTO } from "./association.dto";
import { Member } from "./association.member";

@ApiTags("associations")
@Controller("associations")
@UseGuards(AuthGuard("jwt"))
export class AssociationsController {

  constructor(private service: AssociationsService) {
  };

  @Get()
  @ApiOkResponse({
    description: "All the associations of the database."
  })
  async getAll(): Promise<AssociationDTO[]> {
    return await this.service.getAllDto();
  }

  @Get(":id")
  @ApiOkResponse({
    description: "The association being searched for."
  })
  @ApiNotFoundResponse({
    description: "No association for the specified ID."
  })
  async getById(@Param() parameter: AssociationParamID): Promise<AssociationDTO> {
    const association = await this.service.getByIdDto(+parameter.id);
    if (!association) {
      throw new HttpException("No association for the specified ID.", 404);
    }

    return association;
  }

  @Get(":id/members")
  @ApiOkResponse({
    description: "The users belonging to the association being searched for."
  })
  @ApiNotFoundResponse({
    description: "No association for the specified ID."
  })
  async getMembers(@Param() parameter: AssociationParamID): Promise<Member[]> {
    const users = await this.service.getMembersDto(+parameter.id);
    if (!users) {
      throw new HttpException("No association for the specified ID.", 404);
    }

    return users;
  }

  @Post()
  @ApiOkResponse({
    description: "The association has been successfully created."
  })
  @ApiNotFoundResponse({
    description: "All attributes must be defined."
  })
  async create(@Body() input: AssociationInput): Promise<Association> {
    if (input.idUsers === undefined || input.name === undefined) {
      throw new HttpException("All attributes must be defined.", 404);
    }

    return await this.service.create(input.idUsers, input.name);
  }

  @Put(":id")
  @ApiOkResponse({
    description: "The association has been successfully updated."
  })
  @ApiNotFoundResponse({
    description: "No association for the specified ID."
  })
  async updateById(@Param() parameter: AssociationParamID, @Body() input: AssociationInput): Promise<Association> {
    const updatedAssociation = await this.service.updateById(+parameter.id, input.idUsers, input.name);
    if (!updatedAssociation) {
      throw new HttpException("No association for the specified ID.", 404);
    }

    return updatedAssociation;
  }

  @Delete(":id")
  @ApiOkResponse({
    description: "The association has been successfully deleted."
  })
  @ApiNotFoundResponse({
    description: "No association for the specified ID."
  })
  async deleteById(@Param() parameter: AssociationParamID): Promise<boolean> {
    const deletedAssociation = await this.service.deleteById(+parameter.id);
    if (!deletedAssociation) {
      throw new HttpException("No association for the specified ID.", 404);
    }

    return deletedAssociation;
  }

  @Put(":id/join")
  @ApiOkResponse({
    description: "The user has successfully joined."
  })
  @ApiNotFoundResponse({
    description: "All attributes must be defined."
  })
  async join(@Param() parameter: AssociationParamID, @Body() input: AssociationJoinInput): Promise<Association> {
    if (input.userId === undefined) {
      throw new HttpException("All attributes must be defined.", 404);
    }

    return await this.service.joinById(+parameter.id, +input.userId);
  }

  @Put(":id/leave")
  @ApiOkResponse({
    description: "The user has successfully leaved."
  })
  @ApiNotFoundResponse({
    description: "All attributes must be defined."
  })
  async leave(@Param() parameter: AssociationParamID, @Body() input: AssociationJoinInput): Promise<Association> {
    if (input.userId === undefined) {
      throw new HttpException("All attributes must be defined.", 404);
    }

    return await this.service.leaveById(+parameter.id, +input.userId);
  }

  @Post(':id/notification')
  @ApiOkResponse({
    description: "The notification has been successfully sent."
  })
  @ApiNotFoundResponse({
    description: "All attributes must be defined."
  })
  async sendNotification(@Param() parameter: AssociationParamID, @Body() input: NotificationInput): Promise<boolean> {
    if (input.message === undefined || input.userId === undefined) {
      throw new HttpException("All attributes must be defined.", 404);
    }
    
    return await this.service.sendNotification(+parameter.id, +input.userId, input.message);
  }
}
