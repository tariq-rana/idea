import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, Logger, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';


@Controller('api/idea')
export class IdeaController {
    constructor(private readonly ideaService:IdeaService){}
    private logger = new Logger('IdeaController');

    private logData(options: any){
        options.user && this.logger.log('USER ', JSON.stringify(options.user));
        options.body && this.logger.log('BODY ', JSON.stringify(options.body));
        options.id && this.logger.log('IDEA ', JSON.stringify(options.id));
    }



    @Get()
    @UseGuards(new AuthGuard())
    findAllIdea(){
            return this.ideaService.findAllIdea();
    }

    @Get(':id')
    @UseGuards(new AuthGuard())
    findOneIdea(@Param('id') id:string){
        return this.ideaService.findOneIdea(id)
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    insertIdea(@User() user, @Body() ideaDTO:IdeaDTO){
        const userId = user.id;
        const body = ideaDTO;
        
        this.logData({user,body});
        
        return this.ideaService.insertIdea(userId, ideaDTO);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id:string,@User() user, @Body() ideaDTO:Partial<IdeaDTO>){
        const body = ideaDTO;
        this.logData({id,user,body});
        return this.ideaService.updateIdea(id,user,ideaDTO);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteIdea(@Param('id') id:string, @User() user){
        this.logData({id,user});
        return this.ideaService.deleteIdea(id,user);
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id:string, @User() user ) {
        const userId = user.id;
        this.logData({id,user});
        return this.ideaService.bookmarkIdea(id,userId);
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id:string, @User() user){
        const userId = user.id;
        this.logData({id,user});
        return this.ideaService.unbookmarkIdea(id,userId);
    }

    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param('id') id:string, @User() user ) {
        const userId = user.id;
        this.logData({id,user});
        return this.ideaService.upvoteIdea(id,userId);
    }

    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downvoteIdea(@Param('id') id:string, @User() user ) {
        const userId = user.id;
        this.logData({id,user});
        return this.ideaService.downvoteIdea(id,userId);
    }
}
