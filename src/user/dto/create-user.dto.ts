import { CreateChatDto } from '../../chat/dto/create-chat.dto';
export class CreateUserDto {
  avatar?: string;
  phone: string;
  username: string;
  education: string; //学历
  major: string; //专业
  career: string; //职业方向
  collegeStage: string; //院校层次
  careerExplore: string; //职业探索
  advantage: string; //个人优势
  email: string;
  password: string;
}


export class createUserMessage {
  code: number;
  msg: string;
}

export class registerInfo extends CreateUserDto {
  SMSCode: string;
}