import { 
  Entity, Column, PrimaryGeneratedColumn
} from 'typeorm';


@Entity("questions")
export class Questions {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	question: string;
}
