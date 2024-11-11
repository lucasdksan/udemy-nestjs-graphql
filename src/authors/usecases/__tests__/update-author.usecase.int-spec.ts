import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { AuthorsPrismaRepository } from "@/authors/repositories/authores-prisma.repository";
import { UpdatedAuthor } from "../update-author.usecase";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";
import { ConflictError } from "@/shared/errors/conflict-error";

describe("UpdateAuthorUsecase Integration tests", ()=>{
    let module: TestingModule;
    let repository: AuthorsPrismaRepository;
    let usecase: UpdatedAuthor.Usecase;
    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new AuthorsPrismaRepository(prisma as any);
        usecase = new UpdatedAuthor.Usecase(repository);
    });

    beforeEach(async ()=> {
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should throws an error when the id is not provided", async () => {
        const input = {
            id: null
        }

        await expect(usecase.execute(input)).rejects.toBeInstanceOf(BadRequestError);
    });

    test("Should throws an error when provided email is duplicated", async ()=> {
        const data = AuthorDataBuilder({ email: "a@a.com" });
        const firstAuthor = await prisma.author.create({ data });
        const secondAuthor = await prisma.author.create({ data: AuthorDataBuilder({}) });

        secondAuthor.email = "a@a.com";

        await expect(usecase.execute(secondAuthor)).rejects.toBeInstanceOf(
            ConflictError
        );
    });

    test("Should be able to update author", async ()=>{
        const data = AuthorDataBuilder({  });
        const author = await prisma.author.create({ data });

        const result = await usecase.execute({
            ...author,
            name: "Lucas",
            email: "lucas@gmail.com"
        });

        expect(result.name).toEqual("Lucas");
        expect(result.email).toEqual("lucas@gmail.com");
    });
});