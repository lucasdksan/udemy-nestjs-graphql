import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";
import { ConflictError } from "@/shared/errors/conflict-error";
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