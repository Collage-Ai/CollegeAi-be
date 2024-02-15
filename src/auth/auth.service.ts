import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { loginMessage } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * @description: 验证用户
   * @param {string} name
   * @param {string} password
   * @return {Boolean} true or false
   * */
  async validateUser(name: string, password: string): Promise<any> {
    const user = await UserService.prototype.findOne(name);
    if (user && user.password === password) {
      // const { password, ...result } = user;
      // return result;
      return true;
    } else {
      return false;
    }
  }

  getUserIdByToken(token: string|string[]): string {
    try {
      if (Array.isArray(token)) {
        token = token[0];
      }
      const { sub } = this.jwtService.verify(token);
      return sub;
    } catch (err) {
      return null;
    }
  }

  /**
   * @description: 生成token
   * @param {Data} User
   *  @returns {string} token
   * **/
  async signToken(User: LoginUserDto, isTesting?: boolean) {
    const user = await this.userService.findOne(User.name);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return this.jwtService.sign({
      name: user.name,
      sub: user.id,
    });
  }

  /**
   * @description: 登录
   * @param {string} name
   * @param {string} password
   * @return {*}
   * */
  async login(name: string, password: string): Promise<loginMessage> {
    try {
      console.log(name, password);
      const user = await this.userService.findOne(name);
      console.log(user);
      const result = new loginMessage();
      if (user && user.password === password) {
        result.token = await this.signToken({
          name,
          password,
        });
        result.code = 0;
        return result;
      } else if (user && user.password !== password) {
        result.code = 1;
        result.msg = '密码错误';
        return result;
      } else {
        result.code = 1;
        result.msg = '用户不存在';
        return result;
      }
    } catch (error) {
      return error;
    }
  }
}
