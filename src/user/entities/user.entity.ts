import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  avatar?: string;

  @Column()
  email: string;

  @Column()
  education: string;

  @Column()
  major: string;

  @Column()
  career: string;

  @Column()
  collegeStage: string;

  @Column()
  careerExplore: string;

  @Column()
  advantage: string;

  @Column({type:'json'})
  skillPoint1: any;

  @Column({type:'json'})
  skillPoint2: any

  @Column({type:'json'})
  skillPoint3: any

  @Column({type:'json'})
  stageAnalysis: any
}
