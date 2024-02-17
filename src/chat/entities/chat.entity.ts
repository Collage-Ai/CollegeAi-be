import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat' })
export class Chat {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: string; // 用于标识用户的ID

  @Column()
  sender: string; // 'user' 或 'ai' 来区分消息的发送者

  @Column()
  message: string; // 消息内容

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date; // 消息发送时间
}
