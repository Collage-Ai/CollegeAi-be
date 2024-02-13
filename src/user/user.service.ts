import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, createUserMessage } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { loginMessage } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<createUserMessage> {
    try {
      //创建用户
      const user = new User();
      //注意查询要使用异步方法
      const userExist = await this.findOne(createUserDto.name);
      const result = new createUserMessage();
      if (userExist) {
        result.code = 1;
        result.msg = '用户名已存在';
        return result;
      } else {
        user.name = createUserDto.name;
        user.password = createUserDto.password;
        this.userRepository.save(user);
        result.code = 0;
        result.msg = '注册成功';
        return result;
      }
    } catch (e) {
      console.log(e);
    }
  }

  findAll() {
    //查询所有用户
    return this.userRepository.find();
  }

  async findOne(name: string): Promise<User | undefined> {
    //根据用户名查询用户
    return this.userRepository.findOne({ where: { name: name } });
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
