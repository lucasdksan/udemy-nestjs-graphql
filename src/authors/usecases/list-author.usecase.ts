import { Usecase as DefaultUsecase } from "@/shared/usecases/usecase";
import { SearchInput } from "@/shared/dtos/search-input";
import { AuthorOutput } from "../dto/author-output";
import { AuthorsPrismaRepository } from "../repositories/authores-prisma.repository";
import { PaginationOutput } from "@/shared/dtos/pagination-output";

export namespace ListAuthor {
    export type Input = SearchInput;

    export type Output = PaginationOutput<AuthorOutput>;

    export class Usecase implements DefaultUsecase<Input, Output> {
        constructor(private readonly authorsRepository: AuthorsPrismaRepository){}
        
        async execute(input: SearchInput): Promise<Output> {
            const searchAuthor = await this.authorsRepository.search(input);

            return {
                items: searchAuthor.items,
                currentPage: searchAuthor.currentPage,
                lastPage: searchAuthor.lastPage,
                perPage: searchAuthor.perPage,
                total: searchAuthor.total,
            }
        }
    }
}