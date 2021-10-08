import {
  IsInt, Length, 
  IsString, IsNotEmpty, IsDateString
} from 'class-validator';

export class messageValidator {
	@Length(3, 30)
	@IsNotEmpty()
	@IsString()
	user: String;

	@Length(1, 500)
	@IsNotEmpty()
	@IsString()
	message: String;

	@IsString()
	@IsNotEmpty()
	type: String;

	@IsNotEmpty()
	@IsDateString()
	date: Date;
}