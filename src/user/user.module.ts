import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { SmsService } from './sms.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRegisteredAskAiHandler } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule),CategoryModule,EventEmitterModule.forRoot()],
  controllers: [UserController],
  providers: [UserService,SmsService,UserRegisteredAskAiHandler],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
