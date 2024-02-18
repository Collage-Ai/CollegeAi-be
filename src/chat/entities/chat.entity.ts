import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat' })
export class Chat {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number; // 用于标识用户的ID

  @Column()
  aiMsg: string; // AI回复的消息

  @Column()
  userMsg: string; // 用户发送的消息

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date; // 消息发送时间

  @Column()
  category: number; // 消息的类别
}
