import { Test, TestingModule } from "@nestjs/testing";
import { AuthorsPrismaRepository } from "../authores-prisma.repository";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { AuthorDataBuilder } from "@/authors/helpers/author-data-builder";

describe("AuthorsPrismaRepository Integration tests", ()=>{
    let module: TestingModule;
    let repository: AuthorsPrismaRepository;

    const prisma = new PrismaClient();

    beforeAll(async ()=> {
        execSync("npm run prisma:migrate--test");

        await prisma.$connect();
        
        module = await Test.createTestingModule({}).compile();
        repository = new AuthorsPrismaRepository(prisma as any);
    });

    beforeEach(async ()=> {
        await prisma.author.deleteMany();
    });

    afterAll(async ()=> {
        await module.close();
    });

    test("Should throws an error when the id is not found", async ()=> {
        await expect(repository.findById("c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a")).rejects.toThrow(new NotFoundError("Author not found using ID c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a"));
    });

    test("Should find an author by id", async ()=> {
        const data = AuthorDataBuilder({});

        const author = await prisma.author.create({
            data
        });

        const result = await repository.findById(author.id);

        expect(result).toStrictEqual(author);
    });

    test("Should create a author", async ()=> {
        const data = AuthorDataBuilder({});
        const author = await repository.create(data);

        expect(author).toMatchObject(data); 
    });

    test("Should throws an error when updating a author not found", async ()=> {
        const data = AuthorDataBuilder({ });
        const author = {
            id: "c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a",
            ...data
        }
        
        await expect(repository.update(author)).rejects.toThrow(
            new NotFoundError("Author not found using ID c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a")
        );
    });
    
    test("Should update a author", async ()=> {
        const data = AuthorDataBuilder({});
        const author = await prisma.author.create({ data });
        const result = await repository.update({
            ...author,
            name: "New Name"
        });

        expect(result.name).toBe("New Name"); 
    });

    test("Should throws an error when deleting a author not found", async ()=> {
        await expect(repository.delete("c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a")).rejects.toThrow(
            new NotFoundError("Author not found using ID c0efdf7c-fe16-4fc0-9fc1-fed8d1fef31a")
        );
    });

    test("Should delete a author", async ()=> {
        const data = AuthorDataBuilder({});
        const author = await prisma.author.create({ data });
        const result = await repository.delete(author.id);

        expect(result).toMatchObject(author); 
    });

    test("Should return null when it does not find an author with the email provided", async ()=> {
        const result = await repository.findByEmail("asda@gmail.com");

        expect(result).toBeNull();
    });
    
    test("Should return a author in email search", async ()=> {
        const data = AuthorDataBuilder({ email: "a@a.com" });
        const author = await prisma.author.create({ data });
        
        const result = await repository.findByEmail("a@a.com");

        expect(result).toMatchObject(author); 
    });

    describe("Search Method", ()=> {
        test("Should only apply pagination when the parameters are null", async ()=> {
            const createdAt = new Date();
            const data = [];
            const arrange = Array(16).fill(AuthorDataBuilder({}));

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
            const result = await repository.search({});

            expect(result.total).toBe(16);
            expect(result.items.length).toBe(15);

            result.items.forEach((item) => {
                expect(item.id).toBeDefined();
            });

            result.items.reverse().forEach((item, index)=> {
                expect(`${item.email}${index + 1}@gmail.com`);
            });
        });

        test("Should apply pagination and ordering", async ()=> {
            const createdAt = new Date();
            const data = [];
            const arrange = "badec";

            arrange.split("").forEach((author, index)=> {
                const timestamp = createdAt.getTime() + index;

                data.push({
                    ...AuthorDataBuilder({ name: author }),
                    email: `author${index}@gmail.com`,
                    createdAt: new Date(timestamp),
                    updatedAt: new Date(timestamp),
                });
            });

            await prisma.author.createMany({ data });
            const result = await repository.search({
                page: 1,
                perPage: 2,
                sort: "name",
                sortDir: "asc"
            });

            const result2 = await repository.search({
                page: 2,
                perPage: 2,
                sort: "name",
                sortDir: "asc"
            });

            expect(result.items[0]).toMatchObject(data[1]);
            expect(result.items[1]).toMatchObject(data[0]);
            expect(result2.items[0]).toMatchObject(data[4]);
            expect(result2.items[1]).toMatchObject(data[2]);
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
            const result = await repository.search({
                page: 1,
                perPage: 2,
                sort: "name",
                sortDir: "asc",
                filter: "TEST"
            });

            const result2 = await repository.search({
                page: 2,
                perPage: 2,
                sort: "name",
                sortDir: "asc",
                filter: "TEST"
            });

            expect(result.items[0]).toMatchObject(data[0]);
            expect(result.items[1]).toMatchObject(data[4]);
            expect(result2.items[0]).toMatchObject(data[2]);
            expect(result2.items.length).toBe(1);
        });
    });
});