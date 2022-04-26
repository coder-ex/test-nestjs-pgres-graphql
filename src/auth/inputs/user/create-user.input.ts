import {ArgsType, Field, InputType, ObjectType} from "@nestjs/graphql";
import {UserEntity} from "../../entities/user.entity";
import {ArgsUserInput} from "../args-user.input";


@InputType()
export class CreateUserInput {
    @Field({nullable: false})
    email: string

    @Field({nullable: false})
    password: string

    @Field({nullable: true})
    groupName?: string

    @Field(() => ArgsUserInput, {nullable: true})
    parent?: ArgsUserInput
}