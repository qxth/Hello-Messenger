import { 
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import {User} from './user.entity' 

@Entity("stashFriends")
export class StashFriends {
  @PrimaryGeneratedColumn()
  idStash: number;

  @Column("int")
  id: number;

  @Column("int")
  idFriend: number;

  @ManyToOne(() => User, user => user.stashFriends, {eager: true})
  user: User;
}
