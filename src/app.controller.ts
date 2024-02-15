import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './app.decorator';
import { AIService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly aiService: AIService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('chat')
  getChat(): Promise<string> {
    return this.aiService.getAIResponse('你好');
  }
}
