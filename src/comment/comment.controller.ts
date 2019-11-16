import { Controller, Get, Post, Delete, Param,  UseGuards, UsePipes,Body } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';

import { CommentService } from './comment.service';
import { CommentDTO } from './comment.dto';
import { User } from '../user/user.decorator';

@Controller('api/comment')
export class CommentController {
    constructor(private readonly commentService:CommentService){}    

    @Get()
    findAllComment(){
        return this.commentService.findAllComment();
    }
    
    @Get(':id')
    findOneComment(@Param('id') id:string){

        return this.commentService.findOneComment(id);
    }

    @Get('idea/:id')
    findCommentByIdea(@Param('id') ideaId:string){
        return this.commentService.findCommentByIdea(ideaId);
    }

    @Get('user/:id')
    findCommentByUser(@Param('id') userId:string){
        return this.commentService.findCommentByUser(userId);
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    insertComment(@Param('id') ideaId:string, @User() user, @Body() comment:CommentDTO){

        return this.commentService.insertComment(ideaId,user.id,comment)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteComment(@Param('id') id:string, @User() user){

        return this.commentService.deleteComment(id,user.id);
    }


}