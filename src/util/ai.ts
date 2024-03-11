#!/usr/bin/env -S npm run tsn -T

import OpenAI from 'openai';
import { stagePrompt } from './prompt';
import axios, { AxiosResponse } from 'axios';
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

async function sendRequest(options: RequestOptions): Promise<AxiosResponse> {
  const { query, isSort, type, userInfo, field } = options;
  const url = `https://htmlpng-mo-tfoormcbnb.cn-hangzhou.fcapp.run?query=${encodeURIComponent(query)}&isSort=${isSort}&type=${encodeURIComponent(type)}&userInfo=${encodeURIComponent(userInfo)}&field=${encodeURIComponent(field)}`;
  try {
    const response = await axios.post(url);
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


export { getAIResponse };
