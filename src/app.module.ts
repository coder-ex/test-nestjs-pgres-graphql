import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {UsersModule} from './auth/users.module';
import { GroupsModule } from './auth/groups.module';


@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/schema.gql',
            sortSchema: true,
            playground: true,
            debug: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                type: config.get<'aurora-data-api'>('TYPEORM_CONNECTION'),
                username: config.get<string>('TYPEORM_USERNAME'),
                password: config.get<string>('TYPEORM_PASSWORD'),
                database: config.get<string>('TYPEORM_DATABASE'),
                host: config.get<string>('TYPEORM_HOST'),
                port: config.get<number>('TYPEORM_PORT'),
                entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
                synchronize: true,
                autoLoadEntities: true,
                logging: true
            })
        }),
        UsersModule,
        GroupsModule,
    ],
    providers: [],
})
export class AppModule {
}
