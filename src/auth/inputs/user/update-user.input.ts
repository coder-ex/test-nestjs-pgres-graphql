import {Field, ID, InputType} from "@nestjs/graphql";
import {ArgsUserInput} from "../args-user.input";
import {ArgsGroupInput} from "../args-group.input";


@InputType()
export class UpdateUserInput {
    @Field(() => ID)
    id: string

    @Field({nullable: true})
    email: string

    @Field({nullable: true})
    password?: string

    @Field({nullable: true})
    isActivated?: boolean

    @Field(() => [ArgsGroupInput], {nullable: true})
    groups?: ArgsGroupInput[]

    @Field(() => ArgsUserInput, {nullable: true})
    parent?: ArgsUserInput
}