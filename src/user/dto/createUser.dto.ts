import { IsEmail, IsEmpty } from 'class-validator';

export class CreateUserDto {

  @IsEmail()
  email!: string;

  @IsEmpty()
  password!: string;
}