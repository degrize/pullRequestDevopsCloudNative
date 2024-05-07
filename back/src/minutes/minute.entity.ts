import { Association } from "src/associations/association.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Minute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  content: string;

  @ManyToOne(() => Association, association => association.id, { eager: true })
  @JoinTable()
  association: Association;

  @ManyToMany(type => User, { eager: true })
  @JoinTable()
  voters: User[];
}