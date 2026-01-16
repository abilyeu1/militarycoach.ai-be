"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const openai_controller_1 = require("./openai.controller");
const openai_service_1 = require("./openai.service");
const user_schema_1 = require("../../schemas/users/user.schema");
const tools_schema_1 = require("../../schemas/tools/tools.schema");
const stream_gateway_1 = require("../../stream.gateway");
const chats_schema_1 = require("../../schemas/chats/chats.schema");
let OpenaiModule = class OpenaiModule {
};
OpenaiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: tools_schema_1.Tool.name, schema: tools_schema_1.ToolSchema },
                { name: chats_schema_1.Chat.name, schema: chats_schema_1.ChatSchema },
            ]),
        ],
        controllers: [openai_controller_1.OpenaiController],
        providers: [openai_service_1.OpenaiService, config_1.ConfigService, stream_gateway_1.StreamGateway],
        exports: [openai_service_1.OpenaiService],
    })
], OpenaiModule);
exports.OpenaiModule = OpenaiModule;
//# sourceMappingURL=openai.module.js.map