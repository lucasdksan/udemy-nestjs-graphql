import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";
import { ConflictError } from "@/shared/errors/conflict-error";
import { AuthorOutput } from "../dto/author-output";

export namespace CreateAuthor {
    export type Input = {
        name: string;
        email: string;
    }

    export type Output = AuthorOutput;
    
    export class Usecase implements DefaultUsecase<Input, Output> {
        constructor(private readonly authorsRepository: AuthorsPrismaRepository){}

        async execute(input: Input): Promise<Output> {
            const { email, name } = input;

            if(!name || !email) throw new BadRequestError("Input data not provided");
            
            const emailExists = await this.authorsRepository.findByEmail(email);

            if(emailExists) throw new ConflictError("Email address used by other author");

            const author = await this.authorsRepository.create(input);

            return author;
        }
    }
}