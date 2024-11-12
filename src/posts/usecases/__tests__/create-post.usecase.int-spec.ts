import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { PostsPrismaRepository } from "@/posts/repositories/posts-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { CreatePost } from "../create-post.usecase";
import { PostDataBuilder } from "@/posts/helpers/posts-data-builder";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import { BadRequestError } from "@/shared/errors/bad-request-error";

jest.setTimeout(30000); 

describe("CreatePostUsecase Integration tests", ()=> {
    let module: TestingModule;
    let postsRepository: PostsPrismaRepository;
    let authorsRepository: AuthorsPrismaRepository;
    let usecase: CreatePost.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();

        module = await Test.createTestingModule({}).compile();
        postsRepository = new PostsPrismaRepository(prisma as any);
        authorsRepository = new AuthorsPrismaRepository(prisma as any);
        usecase = new CreatePost.Usecase(postsRepository, authorsRepository);
    });

    beforeEach(async ()=> {
        await prisma.post.deleteMany();
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should create a post", async ()=>{
        const postData = PostDataBuilder({});
        const authorData = AuthorDataBuilder({});

        const author = await prisma.author.create({ data: authorData });
        const post = await usecase.execute({ authorId: author.id, title: postData.title, content: postData.content });

        expect(post.id).toBeDefined();
        expect(post.createdAt).toBeInstanceOf(Date);
        expect(post.updatedAt).toBeInstanceOf(Date);
        expect(post).toMatchObject({
            title: postData.title,
            content: postData.content,
            published: postData.published,
        });
    });

    test("Should throws error when authorId not provided", async ()=> {
        const postData = PostDataBuilder({});

        await expect(()=> usecase.execute({ 
            authorId: null,
            title: postData.title, 
            content: postData.content
        })).rejects.toBeInstanceOf(BadRequestError);
    });

    test("Should throws error when title not provided", async ()=> {
        const postData = PostDataBuilder({});
        const authorData = AuthorDataBuilder({});

        const author = await prisma.author.create({ data: authorData });

        await expect(()=> usecase.execute({ 
            authorId: author.id,
            title: null, 
            content: postData.content
        })).rejects.toBeInstanceOf(BadRequestError);
    });

    test("Should throws error when content not provided", async ()=> {
        const postData = PostDataBuilder({});
        const authorData = AuthorDataBuilder({});

        const author = await prisma.author.create({ data: authorData });

        await expect(()=> usecase.execute({ 
            authorId: author.id,
            title: postData.title, 
            content: null
        })).rejects.toBeInstanceOf(BadRequestError);
    });
});