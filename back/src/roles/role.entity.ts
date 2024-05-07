import { Association } from "src/associations/association.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Role {
  @Column()
  name: string;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  associationId: number;

  @ManyToOne(() => Association, association => association.id)
  association: Association;

  @ManyToOne(() => User, user => user.id)
  user: User;
}