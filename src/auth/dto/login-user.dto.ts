import { CreateUserDto } from "src/user/dto/create-user.dto";

export class LoginUserDto {
  readonly phone: string;
  readonly password: string;
}

export class LoginUserResponse {
 token: string;
  userInfo : CreateUserDto
}