import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO, IdeaRO } from './idea.dto';

import { UserEntity } from '../user/user.entity';
import { UserRO } from '../user/user.dto';
import { Votes } from '../shared/votes.enum';



@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private readonly ideaRepository:Repository<IdeaEntity>,
                @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>){}

   
   
    private toResponseObject(idea: IdeaEntity):IdeaRO{
        const responseObject:any = {...idea, author:idea.author.toResponseObject(false)};

        if(responseObject.upvotes){
            responseObject.upvotes = idea.upvotes.length;
        }

        if(responseObject.downvotes){
            responseObject.downvotes = idea.downvotes.length;
        }

        return responseObject;
    }

    private ensureOwnership(idea: IdeaEntity, userId:string){
        if(idea.author.id !== userId){
            throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
        }
    }

    private async vote(idea: IdeaEntity, user:UserEntity, vote: Votes){
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if(
            idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
            idea[vote].filter(voter => voter.id === user.id).length > 0
        ){
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id) ;
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
            await this.ideaRepository.save(idea);

        }else if(idea[vote].filter(voter => voter.id === user.id).length < 1 ){
            idea[vote].push(user);
            await this.ideaRepository.save(idea);
        }else{
            throw new HttpException('Unable to cast vote',HttpStatus.BAD_REQUEST);
        }

        return idea;
    }

    async findAllIdea(): Promise<IdeaRO[]>{
        const ideas = await this.ideaRepository.find({relations:['author','upvotes','downvotes','comments']});
        //return ideas;
        return ideas.map(idea => this.toResponseObject(idea)) ;
    }

    
    async findOneIdea(id:string): Promise<IdeaRO>{
        const idea = await this.ideaRepository.findOne(id,{relations:['author','upvotes','downvotes','comments']});
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

    async bookmarkIdea(id:string, userId:string){
        const idea = await this.ideaRepository.findOne(id);
        const user = await this.userRepository.findOne({where:{id:userId},
             relations:['bookmarks']});

        if(user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        }
        else{
            throw new HttpException('Idea already bookmarked',HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(false);
    }
    
    async unbookmarkIdea(id:string, userId:string){
        const idea = await this.ideaRepository.findOne(id);
        const user = await this.userRepository.findOne({where:{id:userId},
             relations:['bookmarks']});

        if(user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0){
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id)
            await this.userRepository.save(user);
        }
        else{
            throw new HttpException('Idea removed bookmarked',HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(false);
    }

    async upvoteIdea(id:string, userId:string){
        let idea = await this.ideaRepository.findOne({where:{id}, 
                relations:['author','upvotes','downvotes']});

        const user = await this.userRepository.findOne({where:{id:userId}});

        idea = await this.vote(idea,user,Votes.UP);
        return this.toResponseObject(idea);
    }

    async downvoteIdea(id:string, userId:string){
        let idea = await this.ideaRepository.findOne({where:{id}, 
                relations:['author','upvotes','downvotes']});

        const user = await this.userRepository.findOne({where:{id:userId}});

        idea = await this.vote(idea,user,Votes.DOWN);
        return this.toResponseObject(idea);
    }
}
