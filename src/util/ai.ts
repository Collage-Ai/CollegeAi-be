
import OpenAI from 'openai';
import { stagePrompt } from './prompt';
import axios, { AxiosResponse } from 'axios';
import { ActivityData, ActivityInfo } from './type';

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

function validateActivity(activity: any): boolean {
  // 示例验证逻辑
  return activity.hasOwnProperty('活动名称') && activity['活动名称'] !== '';
}

function processActivityData(data: any): ActivityData[] {
  if (typeof data === 'string') {
    // 如果数据是字符串，尝试将其解析为JSON
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error('JSON解析失败:', error);
      return [];
    }
  }

  // 确保数据是数组格式，如果不是则将其包装在数组中
  if (!Array.isArray(data)) {
    data = [data];
  }

  return data.map((item) => {
    if (typeof item === 'string') {
      // 再次检查数据项是否为字符串，尝试解析JSON
      try {
        item = JSON.parse(item);
      } catch (error) {
        console.error('JSON解析失败:', error);
        return [];
      }
    }

    // 对每个技能点的内容进行过滤和验证
    const processedContent = item.content ? item.content.filter(validateActivity) : [];

    // 返回格式化后的技能点数据
    return {
      ...item,
      content: processedContent
    };
  });
}



export { sendCloudFnRequest,processActivityData };

// console.log(getAIResponse('一名大三的学生，来自985大学，目前有一段运营实习，有一段产品实习，目标是产品经理，喜欢探索人性和产品，有一些技术基础。'))