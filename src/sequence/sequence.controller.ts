import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import {
  CreateSequenceDto,
  UpdateSequenceDto,
} from '../story/dto/sequence.dto';
import { ProgramPipe } from 'src/pipes/program/program.pipe';

@Controller('sequence')
export class SequenceController {
  constructor(private sequenceService: SequenceService) {}

  @Get('/:id')
  get(@Param('id') sequenceId: number) {
    return this.sequenceService.get(sequenceId);
  }

  @Post()
  create(@Body(ProgramPipe) sequenceDto: CreateSequenceDto) {
    return this.sequenceService.create(sequenceDto);
  }

  @Patch('/:id')
  update(
    @Param('id') sequenceId: number,
    @Body(ProgramPipe) sequenceDto: UpdateSequenceDto,
  ) {
    return this.sequenceService.update(sequenceId, sequenceDto);
  }
}
