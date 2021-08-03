import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { CreateSequenceDto } from '../story/dto/sequence.dto';
import { CreateNodeDto } from './dto/sequence-node.dto';
import { CreateChoiceDto } from '../choice/dto/choice.dto';

@Controller('sequence')
export class SequenceController {
  constructor(private sequenceService: SequenceService) {}

  @Get('/:id')
  get(@Param('id') sequenceId: number) {
    return this.sequenceService.get(sequenceId);
  }

  @Post()
  create(@Body() sequenceDto: CreateSequenceDto) {
    return this.sequenceService.create(sequenceDto);
  }

  @Post('/:id/add')
  addNode(@Param('id') sequenceId: number, @Body() nodeDto: CreateNodeDto) {
    return this.sequenceService.addNode(sequenceId, nodeDto);
  }

  @Post('/:id/addChoice')
  addChoice(
    @Param('id') sequenceId: number,
    @Body() choiceDto: CreateChoiceDto,
  ) {
    return this.sequenceService.addChoice(sequenceId, choiceDto);
  }
}
