import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserService} from "../../services/user/user.service";
import {UserEntity} from "../../entities/user.entity";
import {CreateUserInput} from "../../inputs/user/create-user.input";
import {UpdateUserInput} from "../../inputs/user/update-user.input";


@Resolver('User')
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Mutation(() => UserEntity)
    async createUser(@Args('createUser') args: CreateUserInput): Promise<UserEntity> {
        return await this.userService.createUser(args);
    }

    @Query(() => [UserEntity])
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getAllUsers();
    }

    @Query(() => [UserEntity])
    async getTreeAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getTreeAllUsers();
    }

    @Query(() => UserEntity)
    async getOneUser(@Args('id') id: string): Promise<UserEntity> {
        return await this.userService.getOneUser(id);
    }

    @Query(() => UserEntity)
    async getTreeOneUser(@Args('id') id: string): Promise<UserEntity> {
        return await this.userService.getTreeOneUser(id);
    }

    @Mutation(() => String)
    async removeUser(@Args('id') id: string): Promise<String> {
        return await this.userService.removeUser(id);
    }

    @Mutation(() => UserEntity)
    async updateUser(@Args('updateUser') args: UpdateUserInput): Promise<UserEntity> {
        return await this.userService.updateUser(args);
    }
}
