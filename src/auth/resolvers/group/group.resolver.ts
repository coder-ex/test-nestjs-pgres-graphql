import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {GroupService} from "../../services/group/group.service";
import {GroupEntity} from "../../entities/group.entity";
import {CreateGroupInput} from "../../inputs/group/create-group.input";
import {UpdateGroupInput} from "../../inputs/group/update-group.input";


@Resolver('Group')
export class GroupResolver {
    constructor(private readonly groupService: GroupService) { }

    @Mutation(() => GroupEntity)
    async createGroup(@Args('createGroup') createGroupInput: CreateGroupInput): Promise<GroupEntity> {
        return await this.groupService.createGroup(createGroupInput);
    }

    @Query(()=> [GroupEntity])
    async getGroupAll(): Promise<GroupEntity[]> {
        return this.groupService.getGroupAll();
    }

    @Query(() => GroupEntity)
    async getGroupOne(@Args('id') id: string): Promise<GroupEntity> {
        return this.groupService.getGroupOne(id);
    }

    @Mutation(() => String)
    async removeGroup(@Args('id') id: string): Promise<string> {
        return this.groupService.removeGroup(id);
    }

    @Mutation(() => GroupEntity)
    async updateGroup(@Args('updateGroup') args: UpdateGroupInput): Promise<GroupEntity> {
        return this.groupService.updateGroup(args);
    }
}
