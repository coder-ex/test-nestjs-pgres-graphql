import {Field, ID, InputType} from "@nestjs/graphql";


@InputType()
export class ArgsGroupInput {
    @Field({nullable: true})
    name?: string
}