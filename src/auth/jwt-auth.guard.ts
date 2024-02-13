import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLICK_KEY } from 'src/app.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLICK_KEY, [
      //getHandler()方法返回对将要调用的处理程序的引用
      context.getHandler(),
      //getClass()方法返回这个特定处理程序所属的 Controller 类的类型
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('没有权限访问');
    }
    return user;
  }
}
