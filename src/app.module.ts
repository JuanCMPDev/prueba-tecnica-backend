import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { LikesController } from './likes/likes.controller';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      useUnifiedTopology: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    MoviesModule,
    LikesModule,
  ],
  controllers: [LikesController],
})
export class AppModule {}
