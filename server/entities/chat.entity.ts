import { 
  Entity, Column, PrimaryGeneratedColumn
} from 'typeorm';

@Entity("ChatStorage")
export class Chat {
  @PrimaryGeneratedColumn()
  idChat: number;

  @Column("int")
  idUser: number;

  @Column("int")
  idFriend: number;

  @Column("longtext")
  ChatData: string;

  @Column("datetime")
  Fecha: Date;
}