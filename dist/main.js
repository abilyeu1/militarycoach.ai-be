"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Milcoach APIs')
        .setDescription('API documentation for Milcoach.')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
        .addTag('Milcoach')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await config_1.ConfigModule.envVariablesLoaded;
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('app.port');
    common_1.Logger.log('Database connection established');
    common_1.Logger.log(`🚀 Server up and running at port ${port}`);
    await app.listen(port);
}
;
bootstrap();
//# sourceMappingURL=main.js.map