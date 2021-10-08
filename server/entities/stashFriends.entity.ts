import { 
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import {User} from './user.entity' 

@Entity("StashFriends")
export class StashFriends {
  @PrimaryGeneratedColumn()
  idStash: number;

  @Column("int")
  id: number;

  @Column("int")
  idFriend: number;

  @ManyToOne(() => User, user => user.stashFriends, {eager: true})
  @JoinColumn({name: 'id'})
  user: User;
}
