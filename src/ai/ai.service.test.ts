import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AIService } from './ai.service';

describe('AIService', () => {
  let service: AIService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockResolvedValue({
              data: {
                choices: [{ text: 'Response from AI service' }],
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return AI response', async () => {
    const message = 'Hello, AI';
    const expectedResponse = 'Response from AI service';

    const response = await service.getAIResponse(message);

    expect(httpService.post).toHaveBeenCalledWith(
      process.env.API_URL,
      { input: message },
      { headers: { Authorization: `Bearer ${process.env.API_KEY}` } },
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should throw an error if unable to get response from AI service', async () => {
    const message = 'Hello, AI';
    const error = new Error('Unable to get response from AI service');

    (httpService.post as jest.Mock).mockRejectedValue(error);

    await expect(service.getAIResponse(message)).rejects.toThrow(error);
  });
});
