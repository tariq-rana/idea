import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';


@Controller('idea')
export class IdeaController {
    constructor(private readonly ideaService:IdeaService){}
    @Get()
    findAllIdea(){
            return this.ideaService.findAllIdea();
    }

    @Get(':id')
    findOneIdea(@Param('id') id:string){
        return this.ideaService.findOneIdea(id)
    }

    @Post()
    insertIdea(@Body() idea:IdeaDTO){
        return this.ideaService.insertIdea(idea);
    }

    @Put(':id')
    updateIdea(@Param('id') id:string, @Body() idea:Partial<IdeaDTO>){
        return this.ideaService.updateIdea(id,idea);
    }

    @Delete(':id')
    deleteIdea(@Param('id') id:string){
        return this.ideaService.deleteIdea(id);
    }
}
