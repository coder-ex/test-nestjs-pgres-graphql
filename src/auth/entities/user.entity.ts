import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
    UpdateDateColumn
} from "typeorm";
import {Field, ID, ObjectType} from "@nestjs/graphql";
import {GroupEntity} from "./group.entity";


@ObjectType()
@Entity({name: 'users'})
@Tree("closure-table", {
    closureTableName: "users_closure",
    ancestorColumnName: (column) => "ancestor_" + column.propertyName,
    descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field({nullable: false})
    @Column({type: 'varchar', length: 100, unique: true, nullable: false})
    email: string;

    @Field({nullable: false})
    @Column({type: 'varchar', length: 100, nullable: false})
    password: string;

    @Field({nullable: true})
    @Column({type: 'boolean', name: 'is_activated', default: false})
    isActivated?: boolean;

    //@Field()
    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    //@Field()
    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        update: true
    })
    updatedA: Date;

    @Field(() => [UserEntity], {nullable: true})
    @TreeChildren()
    children: UserEntity[];

    @Field({nullable: true})
    @TreeParent()
    parent: UserEntity;

    @Field(() => [GroupEntity], {nullable: "itemsAndList"})
    @ManyToMany(() => GroupEntity, (group) => group.users, {
        eager: true
    })
    @JoinTable()
    groups?: GroupEntity[];
}
