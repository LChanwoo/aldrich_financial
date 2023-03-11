import { IsEmail, IsEmpty } from "class-validator";
import { CreateUserDto } from "../../user/dto/createUser.dto";

export class LoginDto extends CreateUserDto {}