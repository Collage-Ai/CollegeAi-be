import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sendCloudFnRequest, getAIResponse, processActivityData } from 'src/util/ai';
import { User } from './entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { userInfo } from 'os';

