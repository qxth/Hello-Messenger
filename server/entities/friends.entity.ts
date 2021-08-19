import { 
  Entity, Column, PrimaryGeneratedColumn,
  ManyToMany, JoinColumn, JoinTable, OneToMany, ManyToOne
} from 'typeorm';
import {User} from './user.entity' 

@Entity("Friends")
export class Friends {
  @PrimaryGeneratedColumn()
  idChat: number;

  @Column("int")
  idUser: number;

  @Column("int")
  idFriend: number;

  @ManyToOne(() => User, user => user.friends, {eager: true})
  @JoinColumn({name: 'idFriend'})
  user: User;
}
