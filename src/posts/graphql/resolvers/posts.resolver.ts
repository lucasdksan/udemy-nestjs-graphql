import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Post } from "../models/post";
import { Inject } from "@nestjs/common";
import { CreatePost } from "@/posts/usecases/create-post.usecase";
import { CreatePostInput } from "../inputs/create-post.input";

@Resolver(()=> Post)
export class PostsResolver {
    @Inject(CreatePost.Usecase)
    private createPostUsecase: CreatePost.Usecase;

    @Mutation(()=> Post)
    createPost(@Args("data") data: CreatePostInput) {
        return this.createPostUsecase.execute(data);
    }
}