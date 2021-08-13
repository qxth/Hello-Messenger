import {
  IsInt, Length, 
  IsString, IsNotEmpty
} from 'class-validator';

export class createUser {
	@Length(3, 30)
	@IsNotEmpty()
	@IsString()
	nickname: string;

	@Length(8, 50)
	@IsNotEmpty()
	@IsString()
	password: string;

	@IsInt()
	@IsNotEmpty()
	pregunta: number;

	@Length(1, 100)
	@IsNotEmpty()
	@IsString()
	respuesta: string;
}
export class getQuestions {
	name: string;
	value: string;
}