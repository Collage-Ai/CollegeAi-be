import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}
  async create(createSkillDto: CreateSkillDto) {
    try {
    return await this.skillRepository.save(createSkillDto);
    }catch(e){
      throw new Error(e);
    }
  }

  findAll() {
    return `This action returns all skill`;
  }

  findOne(userId: number) {
    //返回用户的技能
    try {
      return this.skillRepository.find({where:{userId}});
    }catch(e){
      throw new Error(e);
    }
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      return this.skillRepository.update({id},updateSkillDto);
    }catch(e){
      throw new Error(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
