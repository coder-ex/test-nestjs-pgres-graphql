import {Field, ID, InputType} from "@nestjs/graphql";


@InputType()
export class ArgsUserInput {
    @Field(() => ID)
    id: string
}