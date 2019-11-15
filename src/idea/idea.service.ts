import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO, IdeaRO } from './idea.dto';

import { UserEntity } from '../user/user.entity';
import { UserRO } from '../user/user.dto';


@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private readonly ideaRepository:Repository<IdeaEntity>,
                @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>){}

   
   
    private toResponseObject(idea: IdeaEntity):IdeaRO{
        return {...idea, author:idea.author.toResponseObject(false)};
    }

    private ensureOwnership(idea: IdeaEntity, userId:string){
        if(idea.author.id !== userId){
            throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
        }
    }
    async findAllIdea(): Promise<IdeaRO[]>{
        const ideas = await this.ideaRepository.find({relations:['author']});
        //return ideas;
        return ideas.map(idea => this.toResponseObject(idea)) ;
    }

    
    async findOneIdea(id:string): Promise<IdeaRO>{
        const idea = await this.ideaRepository.findOne(id,{relations:['author']});
        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    
    }

    async insertIdea(userId, ideaDTO:IdeaDTO):Promise<IdeaRO>{
        const author = await this.userRepository.findOne({where:{id:userId}});
        
        const idea = await this.ideaRepository.create({...ideaDTO,author});
        const newIdea = await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async updateIdea(id:string, user:UserRO ,ideaDTO: Partial<IdeaDTO>):Promise<IdeaRO>{
        let idea = await this.ideaRepository.findOne(id,{relations:['author']});

        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, user.id);
        await this.ideaRepository.update({id},ideaDTO);
        idea = await this.ideaRepository.findOne(id,{relations:['author']});
        return this.toResponseObject(idea);
        


        // const oldIdea = await this.ideaRepository.findOne(id);
        // const newIdea = await this.ideaRepository.merge(oldIdea, idea);
        // return await this.ideaRepository.save(newIdea);
    }

    async deleteIdea(id:string, user:UserRO):Promise<IdeaRO>{
        const idea = await this.ideaRepository.findOne(id,{relations:['author']});
        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, user.id);
        await this.ideaRepository.delete(id);
        return this.toResponseObject(idea);
        
    }
}
