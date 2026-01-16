// Nest JS Imports
import { Module } from '@nestjs/common';

// JWT Import
import { JwtStrategy } from './Guard/jwtStrategy';

// Module Imports
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { S3Module } from './modules/s3/s3.module';
import { ChatsModule } from './modules/chats/chat.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UsersModule,
    DatabaseModule,
    CustomConfigModule,
    StripeModule,
    OpenaiModule,
    ChatsModule,
    FavouriteModule,
    S3Module,
    
  ],
  controllers: [],
  providers: [JwtStrategy],
})

export class AppModule {}
