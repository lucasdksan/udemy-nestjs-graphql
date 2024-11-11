import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase";
import { AuthorOutput } from "../dto/author-output";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";

export namespace DeleteAuthor{
    export type Input = { id: string; };

    export type Output = AuthorOutput;

    export class Usecase implements DefaultUsecase<Input, Output> {
        constructor(private readonly authorsRepository: AuthorsPrismaRepository){}

        async execute(input: Input): Promise<AuthorOutput> {
            const { id } = input;
            const author = await this.authorsRepository.delete(id);

            return author;
        }
    }
}