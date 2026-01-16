// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas Imports
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Service Imports
import { AdminService } from './admin.service';

// Controller Imports
import { AdminController } from './admin.controller';

// Module Imports
import { OpenaiModule } from '../openai/openai.module';
import { Otp, OtpSchema } from 'src/schemas/otp/otp.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StripeService } from '../stripe/stripe.service';
import { UsersModule } from '../users/users.module';
import { Tool, ToolSchema } from 'src/schemas/tools/tools.schema';
import { Support, SupportSchema } from 'src/schemas/support/support.schema';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        UsersModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Otp.name, schema: OtpSchema },
            { name: Tool.name, schema: ToolSchema },
            { name: Support.name, schema: SupportSchema },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('auth.jwt_secret'),
                signOptions: {
                    expiresIn: configService.get('auth.jwt_refresh_expiry'),
                },
            }),
        }),
    ],
    providers: [AdminService, StripeService, ConfigService],
    controllers: [AdminController],
    exports: [StripeService]
})
export class AdminModule {}
