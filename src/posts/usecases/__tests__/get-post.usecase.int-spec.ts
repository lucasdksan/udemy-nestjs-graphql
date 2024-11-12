import { PostsPrismaRepository } from "@/posts/repositories/posts-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { GetPost } from "../get-post.usecase";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { PostDataBuilder } from "@/posts/helpers/posts-data-builder";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import slugify from "slugify";

jest.setTimeout(30000); 

describe("GetPostUsecase Integration tests", ()=> {
    let module: TestingModule;
    let postsRepository: PostsPrismaRepository;
    let authorsRepository: AuthorsPrismaRepository;
    let usecase: GetPost.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();

        module = await Test.createTestingModule({}).compile();
        postsRepository = new PostsPrismaRepository(prisma as any);
        authorsRepository = new AuthorsPrismaRepository(prisma as any);
        usecase = new GetPost.Usecase(postsRepository);
    });

    beforeEach(async ()=> {
        await prisma.post.deleteMany();
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should throws an error when the id is not found", async ()=> {
        await expect(() => usecase.execute({ id: "c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a" }))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    test("Should be able to get post by id", async ()=> {
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

        expect(result).toStrictEqual(post);
    });
});