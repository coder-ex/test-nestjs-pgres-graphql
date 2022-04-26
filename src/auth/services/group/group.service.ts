import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ApiException} from "../../../exceptions/api.exception";
import {GroupEntity} from "../../entities/group.entity";
import {UserEntity} from "../../entities/user.entity";
import {CreateGroupInput} from "../../inputs/group/create-group.input";
import {UpdateGroupInput} from "../../inputs/group/update-group.input";


@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(GroupEntity) private readonly groupRepository: Repository<GroupEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }

    async createGroup(createGroupInput: CreateGroupInput): Promise<GroupEntity> {
        const {name} = createGroupInput;
        const candidate = await this.groupRepository.findOne({name: name})
        if (candidate) {
            throw ApiException.warning(`Группа \'${name}\' уже существует`);
        }
        return await this.groupRepository.save({name: name});
    }

    async getGroupAll(): Promise<GroupEntity[]> {
        return await this.groupRepository
            .createQueryBuilder('groups')
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();
    }

    async getGroupOne(id: string): Promise<GroupEntity> {
        const groups = await this.groupRepository
            .createQueryBuilder('groups')
            .where("groups.id = :id", {id})
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();

        if (!groups[0]) {
            throw ApiException.warning(`Группа с ID \'${id}\' не найдена`);
        }
        //---
        return groups[0];
    }

    async removeGroup(id: string): Promise<string> {
        await this.groupRepository.delete(id);
        return id;
    }

    async updateGroup(args: UpdateGroupInput): Promise<GroupEntity> {
        const {id, name, users} = args;
        //--- используем createQueryBuilder т.к. нужен массив groups.users
        const groups = await this.groupRepository
            .createQueryBuilder('groups')
            .where("groups.id = :id", {id})
            .leftJoinAndSelect('groups.users', 'users')
            .getMany();

        try {
            groups[0].name = name || groups[0].name;
            //--- если массив пользователей пуст, то в группе его не правим
            if (users !== undefined && users.length > 0) {
                groups[0].users.splice(0, groups[0].users.length);  // очистка group.users
                //--- добавление из groups в user.groups
                for (let k in users) {
                    let candidate = await this.userRepository.findOne({id: users[k].id});
                    if (!candidate) continue;
                    groups[0].users.push(candidate);
                }
            }
            await this.groupRepository.save(groups[0]);
        } catch (e) {
            throw ApiException.forbidden(e);
        }
        //---
        return groups[0];
    }
}
