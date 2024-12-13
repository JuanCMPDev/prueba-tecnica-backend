import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FilterMovieDto } from './dto/filter-movie.dto';

@Controller('movies')
@UsePipes(new ValidationPipe({ transform: true }))
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() filterDto: FilterMovieDto) {
    const { query, genre, sortBy, page } = filterDto;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const result = await this.moviesService.getMovies(
      query,
      genre,
      sortBy,
      pageNumber,
    );
    return result;
  }

  @Get('genres')
  async getGenres() {
    const genres = await this.moviesService.getAvailableGenres();
    return genres;
  }

  @Get('genre/:genreId')
  async getMoviesByGenre(
    @Param('genreId') genreId: string,
    @Query() filterDto: FilterMovieDto,
  ) {
    const { query, sortBy, page } = filterDto;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const result = await this.moviesService.getMovies(
      query,
      genreId,
      sortBy,
      pageNumber,
    );
    return result;
  }

  @Get(':id')
  async getMovieById(@Param('id') movieId: string) {
    const movie = await this.moviesService.getMovieById(movieId);
    return movie;
  }

  @Get(':id/recommendations')
  async getRecommendations(
    @Param('id') movieId: string,
    @Query('page') page: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const recommendations = await this.moviesService.getMovieRecommendations(
      movieId,
      pageNumber,
    );
    return recommendations;
  }

  @Get('popular')
  async getPopularMovies(@Query('page') page: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const popularMovies = await this.moviesService.getPopularMovies(pageNumber);
    return popularMovies;
  }
}
