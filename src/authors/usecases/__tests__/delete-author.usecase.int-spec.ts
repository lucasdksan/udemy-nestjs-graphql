import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { DeleteAuthor } from "../delete-author.usecase";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";

describe("DeleteAuthorUsecase Integration tests", ()=>{
    let module: TestingModule;
    let repository: AuthorsPrismaRepository;
    let usecase: DeleteAuthor.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new AuthorsPrismaRepository(prisma as any);
        usecase = new DeleteAuthor.Usecase(repository);
    });

    beforeEach(async ()=> {
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should throws an error when the id is not found", async ()=> {
        await expect(() => usecase.execute({ id: "c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a" }))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    test("Should be able to get author by id", async ()=> {
        const data = AuthorDataBuilder({  });
        const author = await prisma.author.create({ data });

        const result = await usecase.execute({ id: author.id });

        expect(result).toStrictEqual(author);

        const authors = await prisma.author.findMany();

        expect(authors).toHaveLength(0);
    });
});