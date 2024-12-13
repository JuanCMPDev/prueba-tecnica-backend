import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  HttpCode,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoviesService } from '../movies/movies.service';

interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(
    private likesService: LikesService,
    private moviesService: MoviesService,
  ) {}

  @Post(':movieId')
  async addLike(@Param('movieId') movieId: string, @Req() req: AuthRequest) {
    const userId = req.user.userId;
    const like = await this.likesService.addLike(userId, movieId);
    return {
      message: 'Like agregado con éxito',
      like,
    };
  }

  @Get()
  async getUserLikes(@Req() req: AuthRequest) {
    const userId = req.user.userId;
    const likes = await this.likesService.getUserLikes(userId);
    return likes;
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLike(@Param('movieId') movieId: string, @Req() req: AuthRequest) {
    const userId = req.user.userId;
    await this.likesService.removeLike(userId, movieId);
  }

  @Get('movies')
  async getLikedMovies(@Req() req: AuthRequest) {
    const userId = req.user.userId;
    const likes = await this.likesService.getUserLikes(userId);

    if (!likes.length) {
      return [];
    }

    const moviesPromises = likes.map(async (like) => {
      try {
        const movie = await this.moviesService.getMovieById(like.movieId);
        return {
          ...movie,
          likeDate: like.createdAt,
        };
      } catch {
        return null;
      }
    });

    const movies = (await Promise.all(moviesPromises)).filter(
      (m) => m !== null,
    );
    return movies;
  }
}
