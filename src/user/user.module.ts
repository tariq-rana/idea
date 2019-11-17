import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { IdeaEntity } from '../idea/idea.entity';
import { CommentEntity } from '../comment/comment.entity';
import { CommentService } from '../comment/comment.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity,IdeaEntity,CommentEntity])
  ],
  providers: [UserService,UserResolver, CommentService],
  controllers: [UserController]
})
export class UserModule {}
