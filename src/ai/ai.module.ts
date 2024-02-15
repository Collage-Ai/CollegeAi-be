import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
