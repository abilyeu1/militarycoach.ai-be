"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwtStrategy_1 = require("./Guard/jwtStrategy");
const config_module_1 = require("./config/config.module");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const stripe_module_1 = require("./modules/stripe/stripe.module");
const openai_module_1 = require("./modules/openai/openai.module");
const s3_module_1 = require("./modules/s3/s3.module");
const chat_module_1 = require("./modules/chats/chat.module");
const favourite_module_1 = require("./modules/favourite/favourite.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            users_module_1.UsersModule,
            database_module_1.DatabaseModule,
            config_module_1.CustomConfigModule,
            stripe_module_1.StripeModule,
            openai_module_1.OpenaiModule,
            chat_module_1.ChatsModule,
            favourite_module_1.FavouriteModule,
            s3_module_1.S3Module,
        ],
        controllers: [],
        providers: [jwtStrategy_1.JwtStrategy],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map