"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../schemas/users/user.schema");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const otp_schema_1 = require("../../schemas/otp/otp.schema");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const stripe_service_1 = require("../stripe/stripe.service");
const users_module_1 = require("../users/users.module");
const tools_schema_1 = require("../../schemas/tools/tools.schema");
const support_schema_1 = require("../../schemas/support/support.schema");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            config_1.ConfigModule,
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: otp_schema_1.Otp.name, schema: otp_schema_1.OtpSchema },
                { name: tools_schema_1.Tool.name, schema: tools_schema_1.ToolSchema },
                { name: support_schema_1.Support.name, schema: support_schema_1.SupportSchema },
            ]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('auth.jwt_secret'),
                    signOptions: {
                        expiresIn: configService.get('auth.jwt_refresh_expiry'),
                    },
                }),
            }),
        ],
        providers: [admin_service_1.AdminService, stripe_service_1.StripeService, config_1.ConfigService],
        controllers: [admin_controller_1.AdminController],
        exports: [stripe_service_1.StripeService]
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map