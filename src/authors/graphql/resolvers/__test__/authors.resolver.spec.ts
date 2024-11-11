import { Test, TestingModule } from "@nestjs/testing";
import { AuthorsResolver } from "../authors.resolver";

describe("AuthorsResolver", ()=> {
    let resolver: AuthorsResolver;

    beforeAll(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthorsResolver],
        }).compile();

        resolver = module.get<AuthorsResolver>(AuthorsResolver);
    });

    it("Should be define", ()=>{
        expect(resolver).toBeDefined();
    });
});