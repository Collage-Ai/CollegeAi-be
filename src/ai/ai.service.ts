import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AIService {
  constructor(private httpService: HttpService) {}

  async getAIResponse(message: string): Promise<string> {
    const aiApiUrl = process.env.API_URL
    const apiKey = process.env.API_KEY

    try {
      const response = await this.httpService.post(
        aiApiUrl,
        { input: message },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      ).toPromise();

      return response.data.choices[0].text.trim(); // 根据AI服务的响应格式进行调整
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Unable to get response from AI service');
    }
  }
}
