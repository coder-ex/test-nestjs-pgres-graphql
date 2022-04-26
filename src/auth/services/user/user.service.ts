import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, TreeRepository} from "typeorm";
import {ApiException} from "../../../exceptions/api.exception";
import {UserEntity} from "../../entities/user.entity";
import {GroupEntity} from "../../entities/group.entity";
import {CreateUserInput} from "../../inputs/user/create-user.input";
import {UpdateUserInput} from "../../inputs/user/update-user.input";
const bcrypt = require('bcrypt');


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(GroupEntity) private readonly groupRepository: Repository<GroupEntity>,
        @InjectRepository(UserEntity) private readonly treeRepository: TreeRepository<UserEntity>
    ) { }

    async createUser(createUserInput: CreateUserInput): Promise<UserEntity> {
        let {email, password, groupName, parent} = createUserInput;
        let candidate = await this.userRepository.findOne({email: email});
        if(candidate) {
            throw ApiException.warning(`Пользователь с E-Mail ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);

        //--- проверим groupName
        if(groupName === undefined) {
            groupName = 'user';
        }
        //--- создадим группу<Group> - по умолчанию группа user
        let group = await this.addGroup(groupName);
        group = await this.groupRepository.save(group);

        //--- создадим пользователя
        let user = new UserEntity();
        user.email = email;
        user.password = hashPassword;
        user.isActivated = false;
        if(parent)
            user.parent = await this.userRepository.findOne(parent);

        user.groups = [group];
        user = await this.userRepository.save(user);
        //---
        return user;
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async getTreeAllUsers(): Promise<UserEntity[]> {
        return await this.treeRepository.findTrees();
    }

    async getOneUser(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw ApiException.warning(`Пользователь с ID ${id} не найден`);
        }
        //---
        return user;
    }

    async getTreeOneUser(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw ApiException.warning(`Пользователь с ID ${id} не найден`);
        }

        return await this.treeRepository.findDescendantsTree(user);
    }

    async removeUser(id: string): Promise<String> {
        const result = await this.treeRepository.delete(id);
        if(result.affected === 0) {
            throw ApiException.warning(`Пользователь с ID: \'${id}\' не найден`);
        }
        //---
        return id;
    }

    async updateUser(updateUserInput: UpdateUserInput): Promise<UserEntity> {
        const {id, email, isActivated, groups, parent} = updateUserInput;
        if(id === undefined)
            throw ApiException.warning(`Для редактирования не указан ID`);

        let user = await this.userRepository.findOne(id);
        if(!user)
            throw ApiException.warning(`Пользователь с ID: \'${id}\' не существует`);

        try {
            user.email = email || user.email;
            user.isActivated = isActivated || user.isActivated;

            if(parent)
                user.parent = await this.userRepository.findOne(parent);

            if(groups !== undefined  && groups.length > 0) {
                //--- очистка user.groups[]
                user.groups.splice(0, user.groups.length);

                //--- добавление из group в user.group
                for(let i = 0; i < groups.length; i++)
                    user.groups.push(await this.addGroup(groups[i].name));
            }
            user = await this.userRepository.save(user);
        } catch (e) {
            throw ApiException.forbidden(e);
        }
        //---
        return user;
    }

    private async addGroup(name: string): Promise<GroupEntity> {
        let group = await this.groupRepository.findOne({name: name});
        if(!group) {    // если группа не найдена то создадим
            group = new GroupEntity();
            group.name = name;
            group = await this.groupRepository.save(group);
        }
        return group;
    }
}
