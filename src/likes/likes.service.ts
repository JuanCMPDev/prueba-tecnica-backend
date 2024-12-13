import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(@InjectRepository(Like) private likeRepo: Repository<Like>) {}

  async addLike(userId: string, movieId: string): Promise<Like> {
    const existing = await this.likeRepo.findOne({
      where: { userId, movieId },
    });
    if (existing) {
      throw new ConflictException('Ya has dado like a esta película.');
    }

    const like = this.likeRepo.create({ userId, movieId });
    return this.likeRepo.save(like);
  }

  async getUserLikes(userId: string): Promise<Like[]> {
    return this.likeRepo.find({ where: { userId } });
  }

  async removeLike(userId: string, movieId: string): Promise<void> {
    const result = await this.likeRepo.delete({ userId, movieId });
    if (result.affected === 0) {
      throw new NotFoundException('No se encontró un like para esa película.');
    }
  }
}
