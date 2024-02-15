import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('New connection:', client.id);
    const { token } = client.handshake.query;
    const userId = await this.authService.getUserIdByToken(token);

    if (!userId) {
      client.emit('error', 'Invalid or expired token');
      client.disconnect();
      return;
    }

    // 可选：发送历史消息给连接的客户端
    const messages = await this.chatService.getMessagesForUser(userId);
    client.emit('history', messages);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // 断开连接时的逻辑（如果需要）
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { userId } = client.handshake.query;
    // 存储用户发送的消息
    await this.chatService.storeMessage(userId[0], payload.message, 'user');
    
    // 获取AI的响应
    const response = await this.chatService.getAIResponse(payload.message);
    
    // 存储AI的响应
    await this.chatService.storeMessage(userId[0], response, 'ai');
    
    // 将AI的响应发送回客户端
    client.emit('message', { message: response });
  }
  
}
