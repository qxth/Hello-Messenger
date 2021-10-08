import { 
  Entity, Column, PrimaryGeneratedColumn
} from 'typeorm';


@Entity("Questions")
export class Questions {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	question: string;
}
