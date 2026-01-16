// Nest JS Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

// Schema Imports
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Controller Imports
import { AuthController } from './auth.controller';

// Service Imports
import { AuthService } from './auth.service';
import { StripeService } from '../stripe/stripe.service';

// Module imports
import { UsersModule } from '../users/users.module';
import { Otp, OtpSchema } from 'src/schemas/otp/otp.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt_secret'),
        signOptions: {
          expiresIn: configService.get<number>('auth.jwt_refresh_expiry'),
        },
      }),
    }),
  ],
  providers: [AuthService, StripeService],
  controllers: [AuthController],
})
export class AuthModule { }
