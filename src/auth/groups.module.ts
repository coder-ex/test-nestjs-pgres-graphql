import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GroupEntity} from "./entities/group.entity";
import {UserEntity} from "./entities/user.entity";
import { GroupService } from './services/group/group.service';
import { GroupResolver } from './resolvers/group/group.resolver';


@Module({
    imports: [
        TypeOrmModule.forFeature([GroupEntity]),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [GroupService, GroupResolver],
    exports: [GroupService],
})
export class GroupsModule {}
