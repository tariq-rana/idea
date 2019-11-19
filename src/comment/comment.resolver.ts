import { Query, Context, Mutation } from "@nestjs/graphql";
import { Resolver, Args } from "@nestjs/graphql";


import { CommentService } from "./comment.service";
import { CommentDTO } from "./comment.dto";
import { UseGuards, Logger } from "@nestjs/common";
import { AuthGuard } from "../shared/auth.guard";

@Resolver('Comment')
export class CommentResolver {

    constructor(private readonly commentService: CommentService) { }

    @Query()
    async commentAll() {
        return await this.commentService.findAllComment();
    }

    @Query()
    async commentOne(@Args('id') id: string) {
        return await this.commentService.findOneComment(id);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async insertComment(@Args('ideaId') ideaId: string, @Context('user') user, @Args('comment') comment: string) {
        const { id: userId } = user;
        const commentDTO = { comment };
        return await this.commentService.insertComment(ideaId, userId, commentDTO);
    }

    @Mutation()
    @UseGuards(new AuthGuard())
    async deleteComment(@Args('id') id: string, @Context('user') user) {
        const { id: userId } = user;
        return await this.commentService.deleteComment(id, userId);
    }
}