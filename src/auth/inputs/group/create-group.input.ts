import {Field, InputType} from "@nestjs/graphql";


@InputType()
export class CreateGroupInput {
    @Field({nullable: false})
    name: string
}
