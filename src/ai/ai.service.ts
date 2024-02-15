import { Injectable, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AIService {
  constructor(private httpService: HttpService) {}

  async getAIResponse(message: string): Promise<string> {
    const aiApiUrl = process.env.API_URL
    const apiKey = process.env.API_KEY
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          aiApiUrl,
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`, // 使用你的OpenAI API密钥
              'Content-Type': 'application/json',
            },
          },
        ).pipe(
          map(res => {
            if (!(res.status === 200)) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.data.choices[0].message.content;
          }),
        ),
      );

      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      if(error.code === 'invalid_api_key'){
        throw new Error('Invalid API key');
      }
      throw new Error('Unable to get response from AI service');
    }
  }
}
