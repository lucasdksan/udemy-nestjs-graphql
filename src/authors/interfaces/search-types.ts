import { Author } from "../graphql/models/author";

export type SearchParams = {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    sortDir?: "asc" | "desc";
}

export type SearchResult = {
    items: Author[];
    currentPage: number;
    perPage: number;
    lastPage: number;
    total: number
}