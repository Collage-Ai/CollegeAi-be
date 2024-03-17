
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

      const processedData = data.map(group => ({
        ...group,
        content: group.content.filter(activity => validateActivity(activity))
    }));

    return processedData;
  });
}

function validateActivity(activity: ActivityInfo): boolean {
  // 确保活动对象中的所有字段都是非空字符串
  return Object.values(activity).every(value => typeof value === 'string' && value.trim() !== '');
}


export { sendCloudFnRequest,processActivityData };

// console.log(getAIResponse('一名大三的学生，来自985大学，目前有一段运营实习，有一段产品实习，目标是产品经理，喜欢探索人性和产品，有一些技术基础。'))