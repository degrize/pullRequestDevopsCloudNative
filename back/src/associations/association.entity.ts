import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Minute } from '../minutes/minute.entity';

@Entity()
export class Association {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  users: User[];

  @OneToMany(() => Minute, (minute) => minute.association)
  minutes: Minute[];
}
