import { PrismaService } from './../database/prisma/prisma.service';
import { Module } from "@nestjs/common";
import { AuthorsResolver } from "./graphql/resolvers/authors.resolver";
import { DatabaseModule } from "@/database/database.module";
import { AuthorsPrismaRepository } from "./repositories/authores-prisma.repository";

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
        }
    ]
})
export class AuthorsModule {}
