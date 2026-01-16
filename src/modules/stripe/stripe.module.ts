// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Module imports
import { UsersModule } from '../users/users.module';

// Schema Imports
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Controller Imports
import { StripeController } from './stripe.controller';

// Service Imports
import { StripeService } from './stripe.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, ConfigService],
  exports: [StripeService]
})
export class StripeModule {}
