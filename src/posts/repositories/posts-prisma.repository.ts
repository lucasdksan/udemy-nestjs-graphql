import { PrismaService } from "@/database/prisma/prisma.service";
import { Post } from "../graphql/models/post";
import { PostsRepository } from "../interfaces/post.repository";
import { NotFoundError } from "@/shared/errors/not-found-error";

export class PostsPrismaRepository implements PostsRepository {
    constructor(private readonly prisma: PrismaService){}

    async create(data: Omit<Post, "id" | "createdAt" | "updatedAt" | "author">): Promise<Post> {
        return await this.prisma.post.create({ data });
    }

    async update(post: Post): Promise<Post> {
        await this.get(post.id);

        const postUpdated = await this.prisma.post.update({
            data: post,
            where: {
                id: post.id
            }
        });

        return postUpdated;
    }

    async findById(id: string): Promise<Post> {
        return this.get(id);
    }
    
    async findBySlug(slug: string): Promise<Post> {
        const post = await this.prisma.post.findUnique({ 
            where: { slug }
        });

        return post;
    }

    async get(id: string): Promise<Post> {
        const post = await this.prisma.post.findUnique({ 
            where: { id }
        });

        if(!post) throw new NotFoundError(`Post not found using ID ${id}`); 
    
        return post;
    }
    
}