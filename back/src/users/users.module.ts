import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AssociationsModule } from "src/associations/associations.module";
import { MinutesModule } from "src/minutes/minutes.module";

@Module({
  imports: [
    forwardRef(() => AssociationsModule),
    forwardRef(() => MinutesModule),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {
}
