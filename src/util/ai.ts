#!/usr/bin/env -S npm run tsn -T

import OpenAI from 'openai';
import { stagePrompt } from './prompt';
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

export { getAIResponse };
