import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AssociationsModule } from "./associations/associations.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Association } from "./associations/association.entity";
import { User } from "./users/user.entity";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/role.entity";
import { MinutesModule } from "./minutes/minutes.module";
import { Minute } from "./minutes/minute.entity";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [User, Association, Role, Minute],
      synchronize: true
    }),
    UsersModule, AssociationsModule, AuthModule, RolesModule, MinutesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
