import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sendCloudFnRequest, getAIResponse, processActivityData } from 'src/util/ai';
import { User } from './entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { userInfo } from 'os';

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
  constructor(private readonly usersService: UserService) {}
  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredAskAiEvent) {
    // 这里可以并发执行长时间运行的任务，不会阻塞用户注册
    Promise.all([
      sendCloudFnRequest({
        query: event.userInfo.career,
        isSort: false,
        type: 'activity',
        userInfo: JSON.stringify(event.userInfo),
        field: event.userInfo.career,
      }),
      getAIResponse(JSON.stringify(event.userInfo)),
    ])
      .then(([skillPoint, stageAnalysis]) => {
        const initialUser = this.usersService.findOne(event.userPhone);
        let formatedSkillPoint = processActivityData(skillPoint)
        let user = new UpdateUserDto();
        user = {
          ...initialUser,
          skillPoint1: formatedSkillPoint[0],
          SkillPoint2: formatedSkillPoint[1],
          SkillPoint3: formatedSkillPoint[2],
          stageAnalysis: stageAnalysis,
        };
        this.usersService.update(event.userInfo.id, user);
      })
      .catch((error) => {
        // 处理错误
        console.error('用户注册后AI分析失败', error);
        throw new InternalServerErrorException('内部服务器错误');
      });
  }
}
