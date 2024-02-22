import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { SmsService } from './sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule),CategoryModule],
  controllers: [UserController],
  providers: [UserService,SmsService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
