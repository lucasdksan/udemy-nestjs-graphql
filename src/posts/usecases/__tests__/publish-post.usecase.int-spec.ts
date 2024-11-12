import { PostsPrismaRepository } from "@/posts/repositories/posts-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { PostDataBuilder } from "@/posts/helpers/posts-data-builder";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import slugify from "slugify";
import { PublishPost } from "../publish-post.usecase";

jest.setTimeout(30000); 

describe("PublishPostUsecase Integration tests", ()=> {
    let module: TestingModule;
    let postsRepository: PostsPrismaRepository;
    let authorsRepository: AuthorsPrismaRepository;
    let usecase: PublishPost.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();

        module = await Test.createTestingModule({}).compile();
        postsRepository = new PostsPrismaRepository(prisma as any);
        authorsRepository = new AuthorsPrismaRepository(prisma as any);
        usecase = new PublishPost.Usecase(postsRepository);
    });

    beforeEach(async ()=> {
        await prisma.post.deleteMany();
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should it changes the published state to true", async ()=> {
        const postData = PostDataBuilder({ });
        const authorData = AuthorDataBuilder({ });
        const slug = slugify(postData.title, { lower: true, });
        const author = await prisma.author.create({ data: authorData });
        const post = await prisma.post.create({ data: {  
            slug,
            published: false,
            content: postData.content,
            title: postData.title,
            author: { connect: author }
        } });

        const result = await usecase.execute({ id: post.id });

        expect(result.published).toBe(true);
    });
});