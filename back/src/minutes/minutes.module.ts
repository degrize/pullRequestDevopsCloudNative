import { forwardRef, Module } from "@nestjs/common";
import { MinutesController } from "./minutes.controller";
import { MinutesService } from "./minutes.service";
import { UsersModule } from "src/users/users.module";
import { AssociationsModule } from "src/associations/associations.module";
import { Minute } from "./minute.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [MinutesController],
  providers: [MinutesService],
  imports: [
    forwardRef(() => AssociationsModule),
    TypeOrmModule.forFeature([Minute])
  ],
  exports: [MinutesService]
})
export class MinutesModule {
}
