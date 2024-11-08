import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase"; 
import { AuthorOutput } from "../dto/author-output";
import { Author } from "../graphql/models/author";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";
import { ConflictError } from "@/shared/errors/conflict-error";
import { BadRequestError } from "@/shared/errors/bad-request-error";

export namespace UpdatedAuthor {
    export type Input = Partial<Author>;

    export type Output = AuthorOutput;

    export class Usecase implements DefaultUsecase<Input, Output> {
        constructor(private readonly authorsRepository: AuthorsPrismaRepository){}

        async execute(input: Partial<Author>): Promise<AuthorOutput> {
            const { email, id, name } = input;

            if(!id) throw new BadRequestError("Id not provided");

            const author = await this.authorsRepository.findById(id);

            if(email)  {
                const emailExists = await this.authorsRepository.findByEmail(email);

                if(emailExists && emailExists.id !== id) throw new ConflictError("Email address used by other author");
            
                author.email = email;
            }

            if(name) author.name = name;

            return this.authorsRepository.update(author);
        }
    }
}