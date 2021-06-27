import { Body, Controller, Post } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { CreateSequenceDto } from '../story/dto/sequence.dto';

@Controller('sequence')
export class SequenceController {
  constructor(private sequenceService: SequenceService) {}

  @Post()
  create(@Body() sequenceDto: CreateSequenceDto) {
    return this.sequenceService.create(sequenceDto);
  }
}
