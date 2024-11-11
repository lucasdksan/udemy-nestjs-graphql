import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Author } from "../models/author";
import { Inject } from "@nestjs/common";
import { ListAuthor } from "@/authors/usecases/list-author.usecase";
import { SearchParamsArgs } from "../args/search-params.arg";
import { SearchAuthorsResult } from "../models/search-authors-result";
import { CreateAuthor } from "@/authors/usecases/create-author.usecase";
import { CreateAuthorInput } from "../inputs/create-author.input";
import { GetAuthor } from "@/authors/usecases/get-author.usecase";
import { AuthorIdArgs } from "../args/author-id.arg";
import { UpdatedAuthor } from "@/authors/usecases/update-author.usecase";
import { UpdateAuthorInput } from "../inputs/update-author.input";
import { DeleteAuthor } from "@/authors/usecases/delete-author.usecase";

@Resolver(()=> Author)
export class AuthorsResolver {
    @Inject(ListAuthor.Usecase)
    private readonly listAuthorUsecase: ListAuthor.Usecase;

    @Inject(CreateAuthor.Usecase)
    private readonly createAuthorUsecase: CreateAuthor.Usecase;

    @Inject(GetAuthor.Usecase)
    private readonly getAuthorUsecase: GetAuthor.Usecase;

    @Inject(UpdatedAuthor.Usecase)
    private readonly updatedAuthorUsecase: UpdatedAuthor.Usecase;

    @Inject(DeleteAuthor.Usecase)
    private readonly deleteAuthorUsecase: DeleteAuthor.Usecase;

    @Query(()=> SearchAuthorsResult)
    async authors(@Args() { page, perPage, sort, sortDir, filter }: SearchParamsArgs) {
        return this.listAuthorUsecase.execute({ page, perPage, sort, sortDir, filter });
    }

    @Query(()=> Author)
    async getAuthor(@Args() { id }: AuthorIdArgs) {
        return this.getAuthorUsecase.execute({ id });
    }

    @Mutation(()=> Author)
    async createAuthor(@Args("data") data: CreateAuthorInput) {
        return this.createAuthorUsecase.execute(data);
    }

    @Mutation(()=> Author)
    async updateAuthor(@Args() { id }: AuthorIdArgs, @Args("data") data: UpdateAuthorInput) {
        return this.updatedAuthorUsecase.execute({ id, ...data });
    }

    @Mutation(()=> Author)
    async deleteAuthor(@Args() { id }: AuthorIdArgs) {
        return this.deleteAuthorUsecase.execute({ id });
    }
}
