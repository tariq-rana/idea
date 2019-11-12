import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private readonly ideaRepository:Repository<IdeaEntity>){}

    async findAllIdea(): Promise<any[]>{
        return await this.ideaRepository.find();
    }

    
    async findOneIdea(id:string): Promise<any>{
        const idea = await this.ideaRepository.findOne(id);
        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        return idea;
    
    }

    async insertIdea(idea:IdeaDTO){
        return await this.ideaRepository.save(idea);
    }

    async updateIdea(id:string, IdeaDTO: Partial<IdeaDTO>){
        const idea = await this.ideaRepository.findOne(id);
        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({id},idea);
        return idea;

        // const oldIdea = await this.ideaRepository.findOne(id);
        // const newIdea = await this.ideaRepository.merge(oldIdea, idea);
        // return await this.ideaRepository.save(newIdea);
    }

    async deleteIdea(id:string){
        const idea = await this.ideaRepository.findOne(id);
        if(!idea){
            throw new HttpException('Not found',HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.delete(id);
        return idea;
    }
}
