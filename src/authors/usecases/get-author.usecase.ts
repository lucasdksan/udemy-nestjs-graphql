import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";
import { AuthorOutput } from "../dto/author-output";

export namespace GetAuthor {
    export type Input = {
        id: string;
    }

    export type Output = AuthorOutput;
    
    export class Usecase implements DefaultUsecase<Input, Output> {
        constructor(private readonly authorsRepository: AuthorsPrismaRepository){}

        async execute(input: Input): Promise<Output> {
            const { id } = input;
            const author = await this.authorsRepository.findById(id);
            
            return author;
        }
    }
}