import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { UsersModule } from "src/users/users.module";
import { AssociationsModule } from "src/associations/associations.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./role.entity";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AssociationsModule),
    TypeOrmModule.forFeature([Role]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
