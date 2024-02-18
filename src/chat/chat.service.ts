import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private aiService: AIService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async getAIResponse(message: string): Promise<string> {
    // 调用AI模块获取响应
    const response = await this.aiService.getAIResponse(message);
    return response;
  }

  async getMessagesForUser(userId: number): Promise<Chat[]> {
    try {
      return await this.chatRepository.find({
        where: { userId },
        order: { time: 'ASC' }, // 根据时间升序排序
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async updateMessage(chat: UpdateChatDto): Promise<Chat> {
    try {
      // 设置当前时间
      chat.time = new Date();

      let oldChat;

      // 如果id存在，则首先尝试使用id来查找记录
      if (chat.id) {
        oldChat = await this.chatRepository.findOne({ where: { id: chat.id } });
      }

      // 如果没有找到记录，并且有aiMsg，则尝试使用aiMsg和userId来查找记录
      if (!oldChat && chat.aiMsg) {
        oldChat = await this.chatRepository.findOne({
          where: { aiMsg: chat.aiMsg, userId: chat.userId },
        });
      }

      // 如果找到了记录，则更新
      if (oldChat) {
        await this.chatRepository.update({ id: oldChat.id }, { ...chat });
      } else {
        // 如果没有找到记录，则插入新记录
        await this.chatRepository.save(chat);
      }

      // 返回更新后的记录，如果是新插入的记录，则直接返回

      return await this.chatRepository.findOne({ where: { id: oldChat.id } });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async storeMessage({ userId, userMsg, aiMsg }: CreateChatDto): Promise<Chat> {
    const chat = new Chat();
    chat.userId = userId;
    chat.aiMsg = aiMsg;
    chat.userMsg = userMsg;
    chat.time = new Date();
    console.log(chat);
    try {
      return await this.chatRepository.save(chat);
    } catch (e) {
      console.log(e);
      //抛出异常
      throw new Error(e);
    }
  }
}
