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

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
