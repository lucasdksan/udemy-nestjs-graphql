import { PrismaService } from './../database/prisma/prisma.service';
import { Module } from "@nestjs/common";
import { AuthorsResolver } from "./graphql/resolvers/authors.resolver";
import { DatabaseModule } from "@/database/database.module";
import { AuthorsPrismaRepository } from "./repositories/authores-prisma.repository";
import { ListAuthor } from './usecases/list-author.usecase';
import { GetAuthor } from './usecases/get-author.usecase';
import { CreateAuthor } from './usecases/create-author.usecase';
import { DeleteAuthor } from './usecases/delete-author.usecase';
import { UpdatedAuthor } from './usecases/update-author.usecase';

@Module({
    imports: [DatabaseModule],
    providers: [
        AuthorsResolver, 
        {
            provide: "PrismaService",
            useClass: PrismaService
        }, 
        {
            provide: "AuthorsRepository",
            useFactory: (prisma: PrismaService) => new AuthorsPrismaRepository(prisma),
            inject: [
                "PrismaService"
            ]
        },
        {
            provide: ListAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new ListAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        },
        {
            provide: GetAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new GetAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        },
        {
            provide: CreateAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new CreateAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        },
        {
            provide: DeleteAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new DeleteAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        },
        {
            provide: UpdatedAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new UpdatedAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        },
    ]
})
export class AuthorsModule {}
