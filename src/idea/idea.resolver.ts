import { Resolver, Query, Args, ResolveProperty,Parent, Context, Mutation } from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { CommentService } from '../comment/comment.service';
import { IdeaDTO } from "./idea.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";


@Resolver()
export class IdeaResolver{
    constructor(private readonly ideaService: IdeaService,
                private readonly commentService: CommentService){}

    @Query()
    ideaAll(@Args('page') page:number, @Args('newest') newest:boolean){
        return this.ideaService.findAllIdea(page,newest);
    }

    @Query()
    ideaOne(@Args('id') ideaId:string){
        return this.ideaService.findOneIdea(ideaId);
    }


    @UseGuards(new AuthGuard())
    @Mutation()
    async insertIdea(@Args('idea') idea:string, @Args('description') description:string, @Context('user') user){
        const {id:userId} = user;
        const ideaDTO:IdeaDTO = {idea,description};
        return await this.ideaService.insertIdea(userId,ideaDTO);
    }

    @UseGuards(new AuthGuard())
    @Mutation()
    async updateIdea(@Args('id') ideaId:string, @Args('idea') idea:string,  @Args('description') description:string, @Context('user') user){
        const ideaDTO:IdeaDTO = {idea,description};
        return await this.ideaService.updateIdea(ideaId,user,ideaDTO);
    }

    @UseGuards(new AuthGuard())
    @Mutation()
    async deleteIdea(@Args('id') ideaId:string, @Context('user') user){
        return await this.ideaService.deleteIdea(ideaId,user);
    }

    @UseGuards(new AuthGuard())
    @Mutation()
    async upvoteIdea(@Args('id') ideaId:string, @Context('user') user){
        const { id:userId } = user;
        return await this.ideaService.upvoteIdea(ideaId,userId);
    }
    
    @UseGuards(new AuthGuard())
    @Mutation()
    async downvoteIdea(@Args('id') ideaId:string, @Context('user') user){
        const { id:userId } = user;
        return await this.ideaService.downvoteIdea(ideaId,userId);
    }

    @UseGuards(new AuthGuard())
    @Mutation()
    async bookmarkIdea(@Args('id') ideaId:string, @Context('user') user){
        const { id:userId } = user;
        return await this.ideaService.bookmarkIdea(ideaId,userId);
    }

    @UseGuards(new AuthGuard())
    @Mutation()
    async unbookmarkIdea(@Args('id') ideaId:string, @Context('user') user){
        const { id:userId } = user;
        return await this.ideaService.unbookmarkIdea(ideaId,userId);
    }



    @ResolveProperty()
    comments(@Parent() parent){
        const {id} = parent;
        return this.commentService.findCommentByIdea(id);
    }


}