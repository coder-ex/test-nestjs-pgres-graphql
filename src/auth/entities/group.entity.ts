import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {Field, ID, InputType, ObjectType} from "@nestjs/graphql";


@ObjectType()
@Entity({name: 'groups'})
export class GroupEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field({nullable: false})
    @Column({type: 'varchar', length: 100, nullable: false})
    name?: string;

    @Field(() => [UserEntity],{nullable: "itemsAndList"})
    @ManyToMany(() => UserEntity, (user) => user.groups)
    users?: UserEntity[]
}
