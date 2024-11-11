import { Test, TestingModule } from "@nestjs/testing";
import { PostsPrismaRepository } from "../posts-prisma.repository";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { PostDataBuilder } from "@/posts/helpers/posts-data-builder";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";

jest.setTimeout(30000); 

describe("PostPrismaRepository Integration tests", ()=>{
    let module: TestingModule;
    let repository: PostsPrismaRepository;

    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new PostsPrismaRepository(prisma as any);
    });

    beforeEach(async ()=> {
        await prisma.post.deleteMany();
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should throws an error when the id is not found", async ()=> {
        await expect(
            repository.findById("c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a"),
        ).rejects.toThrow(
            new NotFoundError("Post not found using ID c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a") 
        );
    });

    test("Should find a post by id", async ()=> {
        const postData = PostDataBuilder({ });
        const authorData = AuthorDataBuilder({ });
        const author = await prisma.author.create({ data: authorData });
        const post = await prisma.post.create({ data: { ...postData, author: { connect: { ...author } } } });

        const result = await repository.findById(post.id);

        expect(result).toStrictEqual(post);
    });

    test("Should create post", async ()=> {
        const postData = PostDataBuilder({ });
        const authorData = AuthorDataBuilder({ });
        const author = await prisma.author.create({ data: authorData });
        const result = await repository.create({ ...postData, authorId: author.id });

        expect(result).toMatchObject(postData);
    });

    test("Should throws an error when updating a post not found", async () => {
        const data = PostDataBuilder({ });
        const post = {
            ...data,
            id: "c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a",
            authorId: "c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a"
        };

        await expect(repository.update(post))
            .rejects.toThrow(new NotFoundError("Post not found using ID c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a") );
    });

    test("Should update post", async ()=> {
        const postData = PostDataBuilder({ });
        const authorData = AuthorDataBuilder({ });
        const author = await prisma.author.create({ data: authorData });
        const post = await repository.create({ ...postData, authorId: author.id });

        const result = await repository.update({
            ...post,
            published: true,
            title: "Updated Title"
        });


        expect(result.published).toEqual(true);
        expect(result.title).toEqual("Updated Title");
    });

    test("Should return null when it does not find an post with the slug provided", async ()=> {
        const result = await repository.findBySlug("fake-slug");

        expect(result).toBeNull();
    });

    test("Should find a post by slug", async ()=> {
        const postData = PostDataBuilder({ });
        const authorData = AuthorDataBuilder({ });
        const author = await prisma.author.create({ data: authorData });
        const post = await prisma.post.create({ data: { ...postData, author: { connect: { ...author } } } });
        const result = await repository.findBySlug(post.slug);
        
        expect(result).toStrictEqual(post);
    });
});