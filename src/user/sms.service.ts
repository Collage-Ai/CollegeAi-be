import { Injectable } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';

@Injectable()
export class SmsService {
  private client: Dysmsapi20170525;

  constructor() {
    const accessKeyId = process.env['ALIBABA_CLOUD_ACCESS_KEY_ID']||"LTAI5tRNJ7yGSriugnR4oU9E"; // 从环境变量中读取
    const accessKeySecret = process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET']||"3KXaH5lQBhyGCWCNtF69e5I1pAORKw"; // 从环境变量中读取
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    config.endpoint = `dysmsapi.aliyuncs.com`;
    this.client = new Dysmsapi20170525(config);
  }

  async sendSms(phoneNumbers: string, templateParam: string): Promise<void> {
    console.log('发送短信', phoneNumbers, templateParam);
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phoneNumbers,
      signName: '天津至善教育科技',
      templateCode: 'SMS_295215377',
      templateParam: `{"code":"${templateParam}"}`,
    });
    const runtime = new $Util.RuntimeOptions({});

    try {
      await this.client.sendSmsWithOptions(sendSmsRequest, runtime);
      console.log('短信发送成功');
    } catch (error) {
      console.error('短信发送失败', error);
      throw error; // 抛出错误，以便调用者可以处理
    }
  }
}
