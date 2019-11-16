import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(@InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity) private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}

    private toResponseObject(comment: CommentEntity){
        const  responseObject:any = comment;
        if(comment.author){
            responseObject.author = comment.author.toResponseObject(false);
        }
        return responseObject;
    }


    async findAllComment():Promise<any>{
        const comments = await this.commentRepository.find({relations:['author', 'idea']});
        return comments.map(comment => this.toResponseObject(comment));
    }

    async findOneComment(id:string):Promise<any>{
        const comment = await this.commentRepository.findOne({where:{id:id}, relations:['author','idea']});
        return this.toResponseObject(comment);
    }

    async findCommentByIdea(ideaId:string):Promise<any>{
        const idea = await this.ideaRepository.findOne({where:{id:ideaId}, relations:['comments','comments.author','comments.idea']});
        return idea.comments.map(comment => this.toResponseObject(comment));
    }

    async findCommentByUser(userId:string):Promise<any[]>{
        const comments = await this.commentRepository.find({where:{author:{id:userId}}, relations:['author']});
        return comments.map(comment => this.toResponseObject(comment));
    }
    
    async insertComment( ideaId:string, userId:string, comment:CommentDTO):Promise<any>{
        const idea = await this.ideaRepository.findOne(ideaId);
        const user = await this.userRepository.findOne(userId);
        const newComment = await this.commentRepository.create({...comment,author:user,idea});
        await this.commentRepository.save(newComment);
        return this.toResponseObject(newComment);
    }

    async deleteComment( id:string, userId:string):Promise<any>{
            const comment = await this.commentRepository.findOne({where:{id}, relations:['author','idea']});

            if(comment.author.id !== userId){
                throw new HttpException('You do not own this comment',HttpStatus.UNAUTHORIZED);
            }
           await this.commentRepository.remove(comment);
           return this.toResponseObject(comment);
    }
}
