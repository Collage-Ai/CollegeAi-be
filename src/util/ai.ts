
import OpenAI from 'openai';
import { stagePrompt } from './prompt';
import axios, { AxiosResponse } from 'axios';
import { ActivityData } from './type';
// gets API Key from environment variable OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.API_URL,
});

async function getAIResponse(userInfo: string, prompt = stagePrompt) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [prompt, { role: 'user', content: `用户信息为${userInfo}` }],
  });
  console.log(completion.choices[0]?.message?.content);
  return completion.choices[0]?.message?.content;
}

interface RequestOptions {
  query: string;
  isSort: boolean;
  type: string;
  userInfo: string;
  field: string;
}

async function sendCloudFnRequest(options: RequestOptions): Promise<AxiosResponse> {
  const { query, isSort, type, userInfo, field } = options;
  const url = `https://htmlpng-mo-tfoormcbnb.cn-hangzhou.fcapp.run`;
  try {
    const response = await axios.post(url, {
      query,
      isSort,
      type,
      userInfo,
      field,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
}

// 使用示例
// sendRequest({
//   query: '产品经理',
//   isSort: false,
//   type: 'activity',
//   userInfo: '一名大三的学生，来自985大学，目前有一段运营实习，有一段产品实习，目标是产品经理，喜欢探索人性和产品，有一些技术基础。',
//   field: '产品经理'
// });
// 函数用于处理并格式化活动数据
function processActivityData(data: any): ActivityData[] {
  // 处理每个数据项，确保其格式化为活动信息数组
  return data.map((item) => {
      // 如果数据项是字符串，尝试将其解析为JSON
      if (typeof item === 'string') {
          try {
              item = JSON.parse(item);
          } catch (error) {
              console.error('JSON解析失败:', error);
              // 解析失败时返回空数组
              return [];
          }
      }

      // 确保数据项是数组格式，如果不是则将其包装在数组中
      if (!Array.isArray(item)) {
          item = [item];
      }

      // 过滤掉任何不符合活动信息结构的数据项
      return item.filter((activity) => typeof activity === 'object' && '活动名称' in activity);
  });
}


export { getAIResponse,sendCloudFnRequest,processActivityData };
