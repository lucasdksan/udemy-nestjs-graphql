import { Author } from "../graphql/models/author";
import { CreateAuthorProps } from "./create-author";
import { SearchParams, SearchResult } from "./search-types";

export interface IAuthorsRepository {
    sortableFields: string[];
    create(data: CreateAuthorProps): Promise<Author>;
    update(author: Author): Promise<Author>;
    delete(id: string): Promise<Author>;
    findById(id: string): Promise<Author>;
    findByEmail(email: string): Promise<Author>;
    search(params: SearchParams): Promise<SearchResult>;
    get(id: string): Promise<Author>;
}