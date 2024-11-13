import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Post } from "../models/post";
import { Inject } from "@nestjs/common";
import { CreatePost } from "@/posts/usecases/create-post.usecase";
import { CreatePostInput } from "../inputs/create-post.input";
import { GetAuthor } from "@/authors/usecases/get-author.usecase";
import { GetPost } from "@/posts/usecases/get-post.usecase";
import { PostIdArgs } from "../args/post-id.arg";
import { PublishPost } from "@/posts/usecases/publish-post.usecase";
import { UnpublishPost } from "@/posts/usecases/unpublish-post.usecase";

@Resolver(()=> Post)
export class PostsResolver {
    @Inject(CreatePost.Usecase)
    private createPostUsecase: CreatePost.Usecase;

    @Inject(GetAuthor.Usecase)
    private getAuthorUsecase: GetAuthor.Usecase;

    @Inject(GetPost.Usecase)
    private getPostUsecase: GetPost.Usecase;

    @Inject(PublishPost.Usecase)
    private publishPostUsecase: PublishPost.Usecase;

    @Inject(UnpublishPost.Usecase)
    private unPublishPostUsecase: UnpublishPost.Usecase;

    @Query(()=> Post)
    async getPost(@Args() { id }: PostIdArgs) {
        return this.getPostUsecase.execute({ id });
    }

    @Mutation(()=> Post)
    async publishPost(@Args() { id }: PostIdArgs) {
        return this.publishPostUsecase.execute({ id });
    }

    @Mutation(()=> Post)
    async unPublishPost(@Args() { id }: PostIdArgs) {
        return this.unPublishPostUsecase.execute({ id });
    }

    @Mutation(()=> Post)
    async createPost(@Args("data") data: CreatePostInput) {
        return this.createPostUsecase.execute(data);
    }

    @ResolveField()
    author(@Parent() post: Post){
        return this.getAuthorUsecase.execute({ id: post.authorId });
    }
}