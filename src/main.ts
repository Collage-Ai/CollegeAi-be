import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalInterceptor } from './interceptor/global.interceptor';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3000);
  console.log(process.env.NODE_ENV,process.env.DB_HOST,process.env.DB_PORT,process.env.DB_USERNAME,process.env.DB_PASSWORD,process.env.DB_NAME);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
