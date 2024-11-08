import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import { CreateAuthor } from "../create-author.usecase";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { ConflictError } from "@/shared/errors/conflict-error";
import { BadRequestError } from "@/shared/errors/bad-request-error";

describe("CreateAuthorUsecase Integration tests", ()=>{
    let module: TestingModule;
    let repository: AuthorsPrismaRepository;
    let usecase: CreateAuthor.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new AuthorsPrismaRepository(prisma as any);
        usecase = new CreateAuthor.Usecase(repository);
    });

    beforeEach(async ()=> {
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    
    test("Should create a author", async ()=> {
        const data = AuthorDataBuilder({});
        const author = await usecase.execute(data);

        expect(author.id).toBeDefined();
        expect(author.createdAt).toBeInstanceOf(Date);
        expect(author).toMatchObject(data); 
    });

    test("Should not be able to create with same email twice", async ()=> {
        const data = AuthorDataBuilder({ email: "a@a.com" });
        await usecase.execute(data);

        await expect(()=> usecase.execute(data)).rejects.toBeInstanceOf(
            ConflictError
        );
    });

    test("Should throws error when not provided", async ()=> {
        const data = AuthorDataBuilder({ name: "" });

        data.name = null;

        await expect(()=> usecase.execute(data)).rejects.toBeInstanceOf(
            BadRequestError
        );
    });

    test("Should throws error when not provided", async ()=> {
        const data = AuthorDataBuilder({ });

        data.email = null;

        await expect(()=> usecase.execute(data)).rejects.toBeInstanceOf(
            BadRequestError
        );
    });
});