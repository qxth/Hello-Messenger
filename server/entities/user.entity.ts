import { 
  Entity, Column, PrimaryGeneratedColumn, 
  BeforeInsert, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn
} from 'typeorm';
import * as argon2 from 'argon2';
import { cryptAnsw } from "./../utils/encrypt";
import {Friends} from './friends.entity'
import {StashFriends} from './stashFriends.entity'

@Entity("UserData")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 30})
  nickname: string;

  @Column({length: 60})
  password: string;

  @Column({default: 1})
  pregunta: number;

  @Column({length: 100, default: ""})
  respuesta: string;

  @BeforeInsert()
  async hash() {
    this.password = await argon2.hash(this.password, {
      hashLength: 4
    });
    this.respuesta = await cryptAnsw(this.respuesta)
  }
  @OneToMany(() => Friends, friends => friends.user)
  friends: Friends[];

  @OneToMany(() => StashFriends, stashFriends => stashFriends.user)
  stashFriends: StashFriends[];
}