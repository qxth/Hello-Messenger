import { 
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import {User} from './user.entity' 

@Entity("stashFriends")
export class StashFriends {
  @PrimaryGeneratedColumn()
  idStash: number;

  @Column({type: "int", unique: true})
  id: number;

  @Column({type: "int", unique: true})
  idFriend: number;

  @ManyToOne(() => User, user => user.stashFriends, {eager: true})
  @JoinColumn({name: 'id'})
  user: User;
}
