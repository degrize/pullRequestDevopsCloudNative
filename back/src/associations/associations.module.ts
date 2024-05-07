import { forwardRef, Module } from "@nestjs/common";
import { AssociationsController } from "./associations.controller";
import { AssociationsService } from "./associations.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Association } from "./association.entity";
import { RolesModule } from "src/roles/roles.module";
import { MinutesModule } from "src/minutes/minutes.module";

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MinutesModule),
    TypeOrmModule.forFeature([Association])],
  exports: [AssociationsService]
})
export class AssociationsModule {
}
