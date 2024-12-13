import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class FilterMovieDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsIn([
    'popularity',
    'release_date',
    'revenue',
    'primary_release_date',
    'original_title',
    'vote_average',
    'vote_count',
  ])
  sortBy?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;
}
