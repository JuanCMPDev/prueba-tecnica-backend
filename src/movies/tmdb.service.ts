import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly baseURL = 'https://api.themoviedb.org/3';

  constructor() {}

  async fetchMovieById(movieId: string): Promise<any> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('TMDB_API_KEY');
    }

    const url = `${this.baseURL}/movie/${movieId}`;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: apiKey,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('Película no encontrada');
      }
      throw new InternalServerErrorException('Error al comunicarse con TMDB');
    }
  }

  async fetchMovies(params: {
    query?: string;
    genre?: string;
    sortBy?: string;
    page?: number;
  }): Promise<any> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('TMDB_API_KEY no configurado');
    }

    let url = '';
    const requestParams: any = {
      api_key: apiKey,
      language: 'en-US',
      include_adult: false,
      page: params.page || 1,
    };

    if (params.query) {
      url = `${this.baseURL}/search/movie`;
      requestParams.query = params.query;
    } else {
      url = `${this.baseURL}/discover/movie`;
      if (params.genre) {
        requestParams.with_genres = params.genre;
      }
      if (params.sortBy) {
        requestParams.sort_by = `${params.sortBy}.desc`;
      } else {
        requestParams.sort_by = 'popularity.desc';
      }
    }

    const response = await axios.get(url, { params: requestParams });
    return response.data;
  }

  async getGenres(): Promise<any> {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `${this.baseURL}/genre/movie/list`;
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });
    return response.data;
  }

  async fetchMovieRecommendations(
    movieId: string,
    page: number = 1,
  ): Promise<any> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('TMDB_API_KEY no configurado');
    }

    const url = `${this.baseURL}/movie/${movieId}/recommendations`;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: apiKey,
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(
          'Película no encontrada para recomendaciones',
        );
      }
      throw new InternalServerErrorException('Error al comunicarse con TMDB');
    }
  }

  async fetchPopularMovies(page: number = 1): Promise<any> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('TMDB_API_KEY no configurado');
    }

    const url = `${this.baseURL}/movie/popular`;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: apiKey,
          language: 'es-ES',
          page,
        },
      });
      return response.data;
    } catch {
      throw new InternalServerErrorException('Error al comunicarse con TMDB');
    }
  }
}
