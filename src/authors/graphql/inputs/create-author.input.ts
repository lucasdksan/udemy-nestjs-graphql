import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateAuthorInput {
    @IsString()
    @IsNotEmpty()
    @Field()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Field()
    email: string;
}