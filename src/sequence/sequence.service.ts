import { Injectable } from '@nestjs/common';
import { CreateSequenceDto } from '../story/dto/sequence.dto';
import { Sequence } from '../entity/Sequence';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private sequenceRepository: Repository<Sequence>,
  ) {}

  create(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    const sequence = this.sequenceRepository.create(sequenceDto);

    return this.sequenceRepository.save(sequence);
  }
}
