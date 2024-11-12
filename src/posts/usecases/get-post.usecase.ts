import { Usecase as DefatultUsecase } from "@/shared/usecases/usecase";
import { PostOutput } from "../dtos/post-output";
import { PostsPrismaRepository } from "../repositories/posts-prisma.repository";

export namespace GetPost {
    export type Input = { id: string };
    
    export type Output = PostOutput;

    export class Usecase implements DefatultUsecase<Input, Output> {
        constructor(private readonly postsRepository: PostsPrismaRepository){}
        
        async execute(input: Input): Promise<PostOutput> {
            const post = await this.postsRepository.findById(input.id);

            return post as PostOutput;
        }
    }
}