import { Resolver, Query, Args, ResolveProperty, Parent, Mutation, Context } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "../comment/comment.service";
import { UserDTO } from "./user.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../shared/auth.guard";


@Resolver('User')
export class UserResolver {
    constructor(private readonly userService: UserService,
        private readonly commentService: CommentService) { }

        
    @Query()
    userOne(@Args('username') username: string) {
        return this.userService.findOneUserByName(username);
    }

    @Query()
    @UseGuards(new AuthGuard())
    async whoami(@Context('user') user){
        const { username } = user;
        return await this.userService.findOneUserByName(username);
    }

    @Query()
    userAll(@Args('page') page: number) {
        return this.userService.findAllUser(page);
    }

    @Mutation()
    login(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDTO = { username, password }
        return this.userService.login(user);
    }

    @Mutation()
    register(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDTO = { username, password }
        return this.userService.register(user);
    }


    @ResolveProperty()
    comments(@Parent() parent) {
        const { id } = parent;
        return this.commentService.findCommentByUser(id);
    }
}