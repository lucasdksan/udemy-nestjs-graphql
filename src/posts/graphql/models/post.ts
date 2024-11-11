import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Post {
    @Field(()=> ID)
    id: string;
    
    @Field()
    title: string;

    @Field()
    slug: string;

    @Field()
    content: string;
    
    @Field()
    published?: boolean;
    
    @Field()
    authorId: string;
    
    @Field()
    createdAt: Date;
    
    @Field()
    updatedAt: Date;
}