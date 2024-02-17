import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, LoginUserResponse } from './dto/login-user.dto';
import { loginMessage } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * @description: 验证用户
   * @param {string} phone
   * @param {string} password
   * @return {Boolean} true or false
   * */
  async validateUser(phone: string, password: string): Promise<any> {
    const user = await UserService.prototype.findOne(phone);
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
    const user = await this.userService.findOne(User.phone);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return this.jwtService.sign({
      phone: user.phone,
      sub: user.id,
    });
  }

  /**
   * @description: 刷新token
   * @param {string} token
   * @return {string} token
   * */
  async refreshToken(token: string): Promise<string> {
    try {
      const { phone, sub } = this.jwtService.verify(token);
      return this.jwtService.sign({
        phone,
        sub,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * @description: 登录
   * @param {string} phone
   * @param {string} password
   * @return {*}
   * */
  async login(phone: string, password: string): Promise<LoginUserResponse|string> {
    try {
      console.log(phone, password);
      const user = await this.userService.findOne(phone);
      const result = new LoginUserResponse();
      console.log(user);
      if (user && user.password === password) {
        let token = await this.signToken({
          phone,
          password,
        });
        result.token = token;
        result.userInfo = user;
        return result;
      } else if (user && user.password !== password) {
        return '密码错误';
      } else {
        return '用户不存在';
      }
    } catch (error) {
      return error;
    }
  }
}
