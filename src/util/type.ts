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

export interface chatMessage {
  identity: string;
  content: string;
  time: Date;
  chatCount: number;
}

export enum ChatCategory {
  "定义与范围"=1,
  "历史发展"=2,
  "当前状态"=3,
  "主要参与者"=4,
  "增长领域"=5,
  "消费者需求"=6,
  "新兴技术"=7,
  "技术应用"=8,
  "典型职位"=9,
  "技能需求"=10,
  "薪酬范围"=11,
  "工作强度"=12,
  "职业满意度"=13,
  "文化与价值观"=14,
  "行业法规"=15,
  "政策支持"=16,
  "全球市场影响"=17,
  "跨国公司作用"=18
}

// 定义活动信息的 TypeScript 类型
export type ActivityInfo = {
  活动名称: string;
  活动日期: string;
  活动地点: string;
  活动简介: string;
  参与方式: string;
};

// 定义数据可能是单个活动信息，也可能是活动信息数组的联合类型
export type ActivityData = ActivityInfo | ActivityInfo[];
