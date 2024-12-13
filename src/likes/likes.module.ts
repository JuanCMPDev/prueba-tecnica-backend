import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), MoviesModule],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
