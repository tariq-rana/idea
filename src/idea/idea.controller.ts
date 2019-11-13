import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, Logger } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
    constructor(private readonly ideaService:IdeaService){}
    private logger = new Logger('IdeaController');

    @Get()
    findAllIdea(){
            return this.ideaService.findAllIdea();
    }

    @Get(':id')
    findOneIdea(@Param('id') id:string){
        return this.ideaService.findOneIdea(id)
    }

    @Post()
    @UsePipes(new ValidationPipe())
    insertIdea(@Body() ideaDTO:IdeaDTO){
        this.logger.log(JSON.stringify(ideaDTO));

        return this.ideaService.insertIdea(ideaDTO);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id:string, @Body() ideaDTO:Partial<IdeaDTO>){
        this.logger.log(JSON.stringify(ideaDTO));
        return this.ideaService.updateIdea(id,ideaDTO);
    }

    @Delete(':id')
    deleteIdea(@Param('id') id:string){
        return this.ideaService.deleteIdea(id);
    }
}
