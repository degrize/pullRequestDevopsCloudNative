import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MinutesService } from './minutes.service';
import { Minute } from './minute.entity';
import { MinuteParamsId } from './minute.params';
import { MinuteInput } from './minute.inputs';
import { User } from 'src/users/user.entity';

@ApiTags('minutes')
@Controller('minutes')
@UseGuards(AuthGuard('jwt'))
export class MinutesController {
  constructor(private service: MinutesService) {}

  @Get()
  @ApiOkResponse({
    description: 'All the minutes of the database.',
  })
  async getAll(): Promise<Minute[]> {
    return await this.service.getAll();
  }

  @Get(':id/voters')
  @ApiOkResponse({
    description: 'The voters belonging to the minute being searched for.',
  })
  @ApiNotFoundResponse({
    description: 'No minute for the specified ID.',
  })
  async getMembers(@Param() parameter: MinuteParamsId): Promise<User[]> {
    const users = await this.service.getVoters(+parameter.id);
    if (!users) {
      throw new HttpException('No minute for the specified ID.', 404);
    }

    return users;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The minute being searched for.',
  })
  @ApiNotFoundResponse({
    description: 'No minute for the specified ID.',
  })
  async getById(@Param() parameter: MinuteParamsId): Promise<Minute> {
    const minute = await this.service.getById(+parameter.id);
    if (!minute) {
      throw new HttpException('No minute for the specified ID.', 404);
    }

    return minute;
  }

  @Post()
  @ApiOkResponse({
    description: 'The minute has been successfully created.',
  })
  @ApiNotFoundResponse({
    description: 'All attributes must be defined.',
  })
  async create(@Body() input: MinuteInput): Promise<Minute> {
    if (
      (input.content === undefined ||
        input.date === undefined ||
        input.idAssociation === undefined,
      input.idVoters === undefined)
    ) {
      throw new HttpException('All attributes must be defined.', 404);
    }

    return await this.service.create(
      input.date,
      input.content,
      input.idVoters,
      +input.idAssociation,
    );
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The minute has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No minute for the specified ID.',
  })
  async updateById(
    @Param() parameter: MinuteParamsId,
    @Body() input: MinuteInput,
  ): Promise<Minute> {
    const updatedMinute = await this.service.updateById(
      +parameter.id,
      input.date,
      input.content,
      input.idVoters,
      +input.idAssociation,
    );
    if (!updatedMinute) {
      throw new HttpException('No minute for the specified ID.', 404);
    }

    return updatedMinute;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The minute has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'No minute for the specified ID.',
  })
  async deleteById(@Param() parameter: MinuteParamsId): Promise<boolean> {
    const deletedAssociation = await this.service.deleteById(+parameter.id);
    if (!deletedAssociation) {
      throw new HttpException('No minute for the specified IDs.', 404);
    }

    return deletedAssociation;
  }
}
