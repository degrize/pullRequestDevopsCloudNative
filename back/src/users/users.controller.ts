import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInput } from './user.inputs';
import { UserParamEmail, UserParamID } from './user.params';
import { AuthGuard } from '@nestjs/passport';
import { UserPasswordChanging } from './user.password.changing';
import { Response } from 'express';
import { UserDTO } from './user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'All the users of the database.',
  })
  async getAll(@Res() res: Response): Promise<UserDTO[]> {
    const users = await this.service.getAllDto();
    res.status(HttpStatus.OK).send({
      data: users,
      messageFromServer: null,
    });
    return users;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'The user being searched for.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  async getById(@Param() parameter: UserParamID, @Res() res: Response,): Promise<UserDTO> {
    const user = await this.service.getByIdDto(+parameter.id);
    if (!user) {
      throw new HttpException('No user for the specified ID.', 404);
    }
    res.status(HttpStatus.OK).send({
      data: user,
      messageFromServer: null,
    });

    return user;
  }

  @Get('email/:email')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'The user being searched for.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  async getByEmail(@Param() parameter: UserParamEmail, @Res() res: Response,): Promise<UserDTO> {
    const user = await this.service.getByEmailDto(parameter.email);
    if (!user) {
      throw new HttpException('No user for the specified email.', 404);
    }

    res.status(HttpStatus.OK).send({
      data: user,
      messageFromServer: null,
    });

    return user;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @ApiNotFoundResponse({
    description: 'All attributes must be defined.',
  })
  async create(@Body() input: UserInput, @Res() res: Response): Promise<User> {
    if (input.lastname === undefined || input.firstname === undefined || input.age === undefined || input.password === undefined || input.email === undefined) {
      throw new HttpException('All attributes must be defined.', 404);
    }

    if (input.lastname === null || input.firstname === null || input.age === null || input.password === null || input.email === null) {
      throw new HttpException('All attributes must be defined.', 404);
    }

    const newUser = await this.service.create(input.firstname, input.lastname, input.email, input.age, input.password);

    if (!newUser) {
      throw new HttpException('Il y a déjà un utilisateur avec cet email dans la base de données.', 404);
    }

    res.status(HttpStatus.CREATED).send({
      data: newUser,
      messageFromServer: `Your account has been created successfully [username] = ${newUser.email}`,
    });
    return newUser;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  async updateByIdWithoutPasswordChanging(@Param() parameter: UserParamID, @Body() input: UserInput, @Res() res: Response): Promise<User> {
    const updatedUser = await this.service.updateByIdWithoutPasswordChanging(+parameter.id, input.firstname, input.lastname, input.email, input.age, input.password);
    if (!updatedUser) {
      throw new HttpException('No user for the specified ID.', 404);
    }

    res.status(HttpStatus.OK).send({
      data: updatedUser,
      messageFromServer: `User ${parameter.id} a bien été modifié`,
    });
    return updatedUser;
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/relationship')
  async deleteUserRelationshipById(
    @Param() parameter: UserParamID,
    @Res() res: Response,
  ): Promise<boolean> {
    const result = await this.service.deleteUserRelationshipById(+parameter.id);
    res.status(HttpStatus.OK).send({
      data: result,
      messageFromServer: null,
    });
    return result;
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteById(
    @Param() parameter: UserParamID,
    @Res() res: Response,
  ): Promise<boolean> {
    const deletedUser = await this.service.deleteById(+parameter.id);
    if (!deletedUser) {
      throw new HttpException('No user for the specified ID.', 404);
    }

    res.status(HttpStatus.OK).send({
      data: deletedUser,
      messageFromServer: `User ${parameter.id} a bien été supprimé`,
    });
    return deletedUser;
  }

  @Put(':id/change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'The user password has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No user for the specified ID.',
  })
  async updatePasswordById(
    @Param() parameter: UserParamID,
    @Body() input: UserPasswordChanging,
    @Res() res: Response,
  ): Promise<User> {
    if (+parameter.id && input.newPassword && input.currentPassword) {
      const updatedUser = await this.service.updatePasswordById(
        +parameter.id,
        input.currentPassword,
        input.newPassword,
      );
      if (!updatedUser) {
        throw new HttpException('User or passwords are wrong', 404);
      } else {
        res.status(HttpStatus.OK).send({
          data: updatedUser,
          messageFromServer: `Le mot de passe de user ${updatedUser.id} a bien été modifié`,
        });
        return updatedUser;
      }
    } else {
      throw new HttpException('The fields are required', 404);
    }
  }
}
