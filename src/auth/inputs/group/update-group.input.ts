import {Field, ID, InputType} from "@nestjs/graphql";
import {ObjectID} from "typeorm";
import {ArgsUserInput} from "../args-user.input";

@InputType()
export class UpdateGroupInput {
    @Field(() => ID)
    id: string

    @Field({nullable: true})
    name: string

    @Field(() => [ArgsUserInput],{nullable: true})
    users: ArgsUserInput[]
}