import {
  IsInt, Length, IsString
} from 'class-validator';

export class authLogin {
  @Length(3, 30)
  @IsString()
  nickname: string;

  @Length(8, 50)
  @IsString()
  password: string;
}