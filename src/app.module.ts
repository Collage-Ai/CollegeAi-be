import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ChatModule } from './chat/chat.module';
import { AIModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalInterceptor } from './interceptor/global.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonLoggerService } from './interceptor/wiston-logger.service';
import { AuthService } from './auth/auth.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hwtest',
      entities: [User],
      charset: 'utf8mb4',
    }),
    ChatModule,
    AIModule,
    WinstonLoggerService,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthModule,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (authService: AuthService, winston: WinstonLoggerService) => {
        return new GlobalInterceptor(winston, authService);
      },
      inject: [AuthService, WinstonLoggerService], // 这里列出GlobalInterceptor依赖的服务
    },
  ],
})
export class AppModule {}
