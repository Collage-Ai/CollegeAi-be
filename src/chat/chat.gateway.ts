import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // 可以在这里处理用户连接逻辑
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // 可以在这里处理用户断开连接的逻辑
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    console.log(`Message received: ${payload.message}`);
    const response = await this.chatService.getAIResponse(payload.message);
    client.emit('message', { message: response });
  }
}
