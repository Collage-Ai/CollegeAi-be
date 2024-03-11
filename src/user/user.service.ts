import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, registerInfo } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SmsService } from './sms.service';
import { getAIResponse, sendCloudFnRequest } from 'src/util/ai';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly categoryService: CategoryService,
    private readonly smsService: SmsService,
  ) {}
  private smsCode: Record<string, string> = {};

  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      console.log(createUserDto);
      const userExist = await this.findOne(createUserDto.phone);
      if (userExist) {
        throw new BadRequestException('用户已存在'); // 使用具体的异常类型
      }
      
      // 使用对象传递简化代码
      const user = this.userRepository.create(createUserDto);

      await this.userRepository.save(user); // 确保等待异步操作完成
      await this.categoryService.addInitChatCategories(user.id);
      const skillPoint = await sendCloudFnRequest({
        query:user.career,
        isSort:false,
        type:'activity',
        userInfo:JSON.stringify(user),
        field:user.career
      })
      const stageAnalysis = await getAIResponse(JSON.stringify(user));
      return '注册成功'; // 直接返回对象，简化代码
    } catch (e) {
      // 根据错误类型进行不同的处理
      if (e instanceof BadRequestException) {
        throw e; // 直接抛出已知异常
      } else {
        console.error('用户创建失败', e); // 记录更具体的错误日志
        throw new InternalServerErrorException('内部服务器错误'); // 抛出内部服务器错误
      }
    }
  }

  findAll() {
    //查询所有用户
    return this.userRepository.find();
  }

  async findOne(phone: string): Promise<User | undefined> {
    console.log(phone);
    try {
      return this.userRepository.findOne({ where: { phone: phone } });
    } catch (e) {
      console.error('查询失败', e);
      throw new InternalServerErrorException('内部服务器错误');
    }
  }

  //获取短信验证码
  async sendCode(phone: string): Promise<string> {
    //生成随机6位数验证码
    let code = this.createCode();
    //调用短信服务发送短信
    try {
      await this.smsService.sendSms(phone, code);
      //将验证码存入smsCode对象中
      this.smsCode[phone] = code;
      return '短信发送成功';
    } catch (error) {
      throw new Error('短信发送失败: ' + error.message);
    }
  }

  //验证短信验证码
  async verifyCode(registerMsg: registerInfo): Promise<CreateUserDto> {
    //将registerMsg.SMSCode和数据库中的验证码进行比对
    if (registerMsg.SMSCode !== this.smsCode[registerMsg.phone]) {
      throw new BadRequestException('验证码错误');
    }
    //如果一致，将registerInfo类型转化为CreateUserDto类型
    let createUserDto = new CreateUserDto();
    createUserDto = registerMsg;
    return createUserDto;
  }

  //更新用户信息
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.userRepository.findOne({
        where: { id: id },
      });
      if (!userToUpdate) {
        throw new BadRequestException('用户不存在');
      }

      // 手动赋值属性以确保正确复制所有需要更新的字段
      Object.assign(userToUpdate, updateUserDto);

      // 保存更新后的用户信息
      return await this.userRepository.save(userToUpdate);
    } catch (e) {
      console.error('用户更新失败', e);
      // 在抛出新的异常时保留原始错误信息
      throw new InternalServerErrorException('内部服务器错误', e.message);
    }
  }
  /**
   * @description: 搜索
   * @param {string} {query,engine}
   * @return {string}
   */
  // async search(body:any): Promise<any> {
  //   const {query, engine} = body;
  //   try {
  //     const results = await searchEngineTool(query, engine);
  //     return results;
  //   } catch (error) {
  //     throw new Error('搜索失败: ' + error.message);
  //   }
  // }

  //生成随机6位数验证码
  createCode() {
    return Math.random().toString().slice(-6);
  }
}
