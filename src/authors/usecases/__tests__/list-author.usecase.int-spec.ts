import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { GetAuthor } from "../get-author.usecase";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import { ListAuthor } from "../list-author.usecase";

describe("ListAuthorUsecase Integration tests", ()=>{
    let module: TestingModule;
    let repository: AuthorsPrismaRepository;
    let usecase: ListAuthor.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new AuthorsPrismaRepository(prisma as any);
        usecase = new ListAuthor.Usecase(repository);
    });

    beforeEach(async ()=> {
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should only apply pagination when the parameters are null", async ()=> {
        const createdAt = new Date();
        const data = [];
        const arrange = Array(3).fill(AuthorDataBuilder({}));

        arrange.forEach((author, index)=> {
            const timestamp = createdAt.getTime() + index;

            data.push({
                ...author,
                email: `author${index}@gmail.com`,
                createdAt: new Date(timestamp),
                updatedAt: new Date(timestamp),
            });
        });

        await prisma.author.createMany({ data });
        const result = await usecase.execute({});

        expect(result).toMatchObject({
            items: data.reverse(),
            total: 3,
            currentPage: 1,
            perPage: 15,
            lastPage: 1,
        });
    });

    
    test("Should apply pagination, filter and ordering", async ()=> {
        const createdAt = new Date();
        const data = [];
        const arrange = ["test", "a", "TEST", "b", "TeSt"];

        arrange.forEach((author, index)=> {
            const timestamp = createdAt.getTime() + index;

            data.push({
                ...AuthorDataBuilder({ name: author }),
                email: `author${index}@gmail.com`,
                createdAt: new Date(timestamp),
                updatedAt: new Date(timestamp),
            });
        });

        await prisma.author.createMany({ data });
        const result = await usecase.execute({
            page: 1,
            perPage: 2,
            sort: "name",
            sortDir: "asc",
            filter: "TEST"
        });

        const result2 = await usecase.execute({
            page: 2,
            perPage: 2,
            sort: "name",
            sortDir: "asc",
            filter: "TEST"
        });

        expect(result).toMatchObject({
            items: [data[0], data[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
            lastPage: 2,
        });
        
        expect(result2).toMatchObject({
            items: [data[2]],
            total: 3,
            currentPage: 2,
            perPage: 2,
            lastPage: 2,
        });
    });
});