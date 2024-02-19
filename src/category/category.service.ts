import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
   @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    
  }
  create(createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryRepository.save(createCategoryDto);
    }catch(e){
      throw new Error(e);
    }
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(userId: number) {
    try {
      return this.categoryRepository.find({where:{userId}});
    }catch(e){
      throw new Error(e);
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async addInitChatCategories(userId: number) {
    const categories = [
      "定义与范围", "历史发展", "当前状态", "主要参与者", "增长领域",
      "消费者需求", "新兴技术", "技术应用", "典型职位", "技能需求",
      "薪酬范围", "工作强度", "职业满意度", "文化与价值观", "行业法规",
      "政策支持", "全球市场影响", "跨国公司作用"
    ];

    const type = 'chat'; // 假设这是固定的类型

    const categoryEntities = categories.map((categoryText, index) => {
      const category = new Category();
      category.userId = userId;
      category.type = type;
      category.categoryText = categoryText;
      return category;
    });

    await this.categoryRepository.save(categoryEntities);
  }
}
