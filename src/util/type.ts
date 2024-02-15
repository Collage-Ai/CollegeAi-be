// 返回的状态码
export enum ResponseCode {
  SUCCESS = 200,
  FAIL = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

// 返回的信息
export enum ResponseMsg {
  SUCCESS = 'success',
  FAIL = 'fail',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not found',
  SERVER_ERROR = 'server error',
}

// 返回的数据
export interface ResponseData {
  status: ResponseCode;
  message: ResponseMsg;
  data?: any;
}

/**
 * 使用方法：
 * import { ResponseCode, ResponseData } from '@/server/utils/type';
 * const response: ResponseData = {
 *  status: ResponseCode.SUCCESS,
 * message: ResponseMsg.SUCCESS,
 * data: { ... }
 * }
 */

export interface chatMessage {
  identity: string;
  content: string;
  time: Date;
  chatCount: number;
}
