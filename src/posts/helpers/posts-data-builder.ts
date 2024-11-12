import { faker } from "@faker-js/faker";
import { Post } from "../graphql/models/post";
import slugify from "slugify";

export function PostDataBuilder(props: Partial<Post>): Omit<Post, "id" | "authorId"> {
    const title = props.title ?? faker.lorem.sentence()
    
    return {
        title: title,
        slug: props.slug ?? slugify(title, { lower: true }),
        content: props.content ?? faker.lorem.paragraph(),
        published: props.published ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
    }
}