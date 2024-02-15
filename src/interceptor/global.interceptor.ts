import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError, of, from } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { WinstonLoggerService } from './wiston-logger.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`[${req.method}] ${req.url} - ${responseTime}ms`);
      }),
      map(data => ({ statusCode: res.statusCode, msg: 'success', data })),
      catchError(error => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          // 如果遇到401错误且是Token过期
          if (status === 401 && error.getResponse().toString().includes('Token expired')) {
            // const token = req.headers.authorization.split(' ')[1]; // 获取Token
            // // 使用from将Promise转换为Observable
            // return from(this.authService.refreshToken(token)).pipe(
            //   tap(newToken => {
            //     req.headers.authorization = `Bearer ${newToken}`; // 更新请求头的Token
            //   }),
            //   switchMap(() => next.handle()), // 使用新Token重试请求
            //   catchError(refreshError => throwError(refreshError)) // 处理Token刷新失败的情况
            // );
            return throwError(() => new UnauthorizedException('Token expired'));
          } else {
            // 对于非Token过期的HttpException，直接返回错误信息
            return throwError(() => new HttpException({ statusCode: status, msg: error.message, data: null }, status));
          }
        } else {
          // 对于非HttpException的错误，返回500错误
          return throwError(() => new HttpException({ statusCode: 500, msg: 'Internal Server Error', data: null }, 500));
        }
      }),
    );
  }
}
