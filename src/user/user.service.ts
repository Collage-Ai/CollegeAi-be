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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  sendCloudFnRequest,
  processActivityData,
} from 'src/util/ai';
import OpenAI from 'openai';
import { stagePrompt } from 'src/util/prompt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2, // 注入事件发射器
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
      this.eventEmitter.emit(
        'user.registered',
        new UserRegisteredAskAiEvent(user.phone, user),
      ); // 发射事件
      await this.categoryService.addInitChatCategories(user.id);

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
    // if (registerMsg.SMSCode !== this.smsCode[registerMsg.phone]) {
    //   throw new BadRequestException('验证码错误');
    // }
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

  //生成随机6位数验证码
  createCode() {
    return Math.random().toString().slice(-6);
  }
}

// 定义事件
export class UserRegisteredAskAiEvent {
  constructor(
    public readonly userPhone: string,
    public readonly userInfo: User,
  ) {}
}

// 定义事件处理器
@Injectable()
export class UserRegisteredAskAiHandler {
  private readonly openai: OpenAI
  constructor(private readonly usersService: UserService,
    
    ) {
      this.openai = new OpenAI({
        apiKey: process.env.API_KEY,
        baseURL: process.env.API_URL,
      });
    }

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredAskAiEvent) {
    console.log('用户注册后AI分析开始', event.userInfo);
    this.handleEventWithRetry(event, 3);
  }


  async getAIResponse(userInfo: string, prompt=stagePrompt): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: JSON.stringify(prompt) }, { role: 'user', content: `用户信息为${JSON.stringify(userInfo)}` }],
    });
    console.log(completion.choices[0]?.message?.content);
    return completion.choices[0]?.message?.content;
  }
  handleEventWithRetry(event: UserRegisteredAskAiEvent, retries: number) {
    Promise.all([
      sendCloudFnRequest({
        query: event.userInfo.career,
        isSort: false,
        type: 'activity',
        userInfo: JSON.stringify(event.userInfo),
        field: event.userInfo.career,
      }),
      this.getAIResponse(JSON.stringify(event.userInfo)),
    ])
      .then(([skillPoint, stageAnalysis]) => {
        this.usersService.findOne(event.userPhone).then((initialUser) => {
          let formatedSkillPoint = processActivityData(skillPoint);
          let userUpdate: UpdateUserDto = {
            ...initialUser,
            skillPoint1: formatedSkillPoint[0],
            skillPoint2: formatedSkillPoint[1], // 注意字段名大小写的一致性
            skillPoint3: formatedSkillPoint[2],
            stageAnalysis: stageAnalysis,
          };
          this.usersService.update(event.userInfo.id, userUpdate);
        });
      })
      .catch((error) => {
        console.error('用户注册后AI分析失败', error);
        if (retries > 0) {
          setTimeout(() => this.handleEventWithRetry(event, retries - 1), 3000);
        } else {
          throw new InternalServerErrorException('内部服务器错误');
        }
      });
  }
}
