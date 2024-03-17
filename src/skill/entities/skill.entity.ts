import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'skill' })
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // 用于标识用户的ID

  @Column()
  title: string; // 技能名称

  @Column({type: 'json'})
  description: any; // 技能描述

  @Column()
  type: string; // 技能类型

  @Column()
  category: number; // 技能归类 0(未分类) 1(归档)
}
