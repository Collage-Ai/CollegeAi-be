export class CreateUserDto {
  readonly name: string;
  readonly password: string;
}

export class createUserMessage {
  code: number;
  msg: string;
}
