import 'reflect-metadata';
import {
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;
}

async function main() {
  // 创建数据库连接
  const connection = await createConnection({
    type: 'mysql', // 更换为您所使用的数据库类型
    host: 'localhost',
    port: 3306, // 数据库端口
    username: 'root', // 数据库用户名
    password: 'root', // 数据库密码
    database: 'hwtest', // 数据库名
    entities: [User],
    synchronize: true, // 自动创建/更新表结构
    charset: 'utf8mb4',
  });

  console.log('Connected to the database.');
}

main().catch((error) => console.log(error));
