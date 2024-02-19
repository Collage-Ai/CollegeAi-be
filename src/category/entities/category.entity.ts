import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // 用于标识用户的ID

  @Column()
  type: string; // chat or skill

  @Column()
  categoryText: string; // 类型

  @Column()
  bigCategory: string; // 大类别
}
