"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = require("./app.config");
const auth_config_1 = require("./auth.config");
const database_config_1 = require("./database.config");
const stripe_config_1 = require("./stripe.config");
const validation_1 = require("./validation");
let CustomConfigModule = class CustomConfigModule {
};
CustomConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                ignoreEnvFile: false,
                validationSchema: validation_1.validationSchema,
                load: [app_config_1.default, database_config_1.default, auth_config_1.default, stripe_config_1.default],
                envFilePath: '.env',
                isGlobal: true,
            }),
        ],
    })
], CustomConfigModule);
exports.CustomConfigModule = CustomConfigModule;
//# sourceMappingURL=config.module.js.map