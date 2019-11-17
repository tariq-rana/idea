import { Resolver, Query, Args, ResolveProperty, Parent } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "../comment/comment.service";

@Resolver('User')
export class UserResolver{
    constructor(private readonly userService:UserService,
                private readonly commentService:CommentService){}

    @Query()
    users(@Args('page') page:number){
        return this.userService.findAllUser(page);
    }

    @ResolveProperty()
    comments(@Parent() parent){
        const {id} = parent;
        return this.commentService.findCommentByUser(id);
    }
}