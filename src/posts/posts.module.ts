import { DatabaseModule } from "@/database/database.module";
import { PrismaService } from "@/database/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { PostsPrismaRepository } from "./repositories/posts-prisma.repository";
import { CreatePost } from "./usecases/create-post.usecase";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { GetPost } from "./usecases/get-post.usecase";
import { PublishPost } from "./usecases/publish-post.usecase";
import { UnpublishPost } from "./usecases/unpublish-post.usecase";
import { PostsResolver } from "./graphql/resolvers/posts.resolver";
import { GetAuthor } from "@/authors/usecases/get-author.usecase";

@Module({
    imports: [DatabaseModule],
    providers: [
        PostsResolver,
        {
            provide: "PrismaService",
            useClass: PrismaService,
        },
        {
            provide: "PostRepository",
            useFactory: (prisma: PrismaService) => new PostsPrismaRepository(prisma),
            inject: ["PrismaService"]
        },
        {
            provide: "AuthorsRepository",
            useFactory: (prisma: PrismaService) => new AuthorsPrismaRepository(prisma),
            inject: ["PrismaService"]
        },
        {
            provide: CreatePost.Usecase,
            useFactory: (
                postsRepository: PostsPrismaRepository,
                authorsRepository: AuthorsPrismaRepository
            ) => {
                return new CreatePost.Usecase(postsRepository, authorsRepository);
            },
            inject: ["PostRepository", "AuthorsRepository"]
        },
        {
            provide: GetPost.Usecase,
            useFactory: (
                postsRepository: PostsPrismaRepository
            ) => {
                return new GetPost.Usecase(postsRepository);
            },
            inject: ["PostRepository"]
        },
        {
            provide: PublishPost.Usecase,
            useFactory: (
                postsRepository: PostsPrismaRepository
            ) => {
                return new PublishPost.Usecase(postsRepository);
            },
            inject: ["PostRepository"]
        },
        {
            provide: UnpublishPost.Usecase,
            useFactory: (
                postsRepository: PostsPrismaRepository
            ) => {
                return new UnpublishPost.Usecase(postsRepository);
            },
            inject: ["PostRepository"]
        },
        {
            provide: GetAuthor.Usecase,
            useFactory: (authorsRepository: AuthorsPrismaRepository) => {
                return new GetAuthor.Usecase(authorsRepository);
            },
            inject: ["AuthorsRepository"]
        }
    ]
})
export class PostsModule {}
