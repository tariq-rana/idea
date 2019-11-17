import { Resolver, Query, Args, ResolveProperty,Parent } from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { CommentService } from '../comment/comment.service';
@Resolver()
export class IdeaResolver{
    constructor(private readonly ideaService: IdeaService,
                private readonly commentService: CommentService){}

    @Query()
    ideas(@Args('page') page:number, @Args('newest') newest:boolean){
        return this.ideaService.findAllIdea(page,newest);
    }

    @ResolveProperty()
    comments(@Parent() parent){
        const {id} = parent;
        return this.commentService.findCommentByIdea(id);
    }
}