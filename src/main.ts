import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ConfigService} from "@nestjs/config";


const bootstrap = async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);  // express базовый функционал
        const config = await app.get(ConfigService);
        const port = config.get<number>('API_PORT') || 3000;
        await app.listen(port, () => {
            console.log(`\n[WEB] ${config.get<string>('API_HOST')} [PORT] ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

bootstrap();