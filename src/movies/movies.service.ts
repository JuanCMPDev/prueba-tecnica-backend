import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Injectable()
export class MoviesService {
  constructor(private tmdbService: TmdbService) {}

  async getMovies(
    query?: string,
    genre?: string,
    sortBy?: string,
    page: number = 1,
  ) {
    const data = await this.tmdbService.fetchMovies({
      query,
      genre,
      sortBy,
      page,
    });
    const baseImageUrl = 'https://image.tmdb.org/t/p/w780';

    const transformedResults = data.results.map((movie: any) => ({
      ...movie,
      poster: movie.poster_path ? `${baseImageUrl}${movie.poster_path}` : null,
      banner: movie.backdrop_path
        ? `${baseImageUrl}${movie.backdrop_path}`
        : null,
    }));

    return {
      ...data,
      results: transformedResults,
    };
  }

  async getMovieById(movieId: string) {
    const data = await this.tmdbService.fetchMovieById(movieId);
    if (!data) {
      throw new NotFoundException('Película no encontrada');
    }

    const baseImageUrl = 'https://image.tmdb.org/t/p/w780';
    const transformed = {
      ...data,
      poster: data.poster_path ? `${baseImageUrl}${data.poster_path}` : null,
      banner: data.backdrop_path
        ? `${baseImageUrl}${data.backdrop_path}`
        : null,
    };

    return transformed;
  }

  async getAvailableGenres() {
    return this.tmdbService.getGenres();
  }

  async getPopularMovies(page: number = 1) {
    const data = await this.tmdbService.fetchPopularMovies(page);
    const baseImageUrl = 'https://image.tmdb.org/t/p/w780';

    const transformedResults = data.results.map((movie: any) => ({
      ...movie,
      poster: movie.poster_path ? `${baseImageUrl}${movie.poster_path}` : null,
      banner: movie.backdrop_path
        ? `${baseImageUrl}${movie.backdrop_path}`
        : null,
    }));

    return {
      ...data,
      results: transformedResults,
    };
  }

  async getMovieRecommendations(movieId: string, page: number = 1) {
    const data = await this.tmdbService.fetchMovieRecommendations(
      movieId,
      page,
    );
    const baseImageUrl = 'https://image.tmdb.org/t/p/w780';

    const transformedResults = data.results.map((movie: any) => ({
      ...movie,
      poster: movie.poster_path ? `${baseImageUrl}${movie.poster_path}` : null,
      banner: movie.backdrop_path
        ? `${baseImageUrl}${movie.backdrop_path}`
        : null,
    }));

    return {
      ...data,
      results: transformedResults,
    };
  }
}
