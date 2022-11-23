import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SequenceService } from './sequence.service';
import {
  CreateSequenceDto,
  UpdateSequenceDto,
} from '../story/dto/sequence.dto';
import { ProgramPipe } from 'src/pipes/program/program.pipe';
import { Request } from 'express';
import { User } from '../../entity/user.entity';
import { SessionGuard } from '../../auth/session.guard';
import { DataSource } from 'typeorm';

@Controller('sequence')
export class SequenceController {
  constructor(
    private sequenceService: SequenceService,
    private readonly ds: DataSource,
  ) {}

  @Get('/:id')
  get(@Param('id') sequenceId: number) {
    return this.sequenceService.get(sequenceId);
  }

  @Get('/forStory/:storyId')
  getForStory(@Param('storyId') storyId: number) {
    return this.sequenceService.forStoryId(storyId);
  }

  @Post()
  create(@Body(ProgramPipe) sequenceDto: CreateSequenceDto) {
    return this.ds.transaction(manager => {
      return this.sequenceService.withTransaction(manager).create(sequenceDto);
    })
  }

  @Patch('/:id')
  update(
    @Param('id') sequenceId: number,
    @Body(ProgramPipe) sequenceDto: UpdateSequenceDto,
  ) {
    return this.sequenceService.update(sequenceId, sequenceDto);
  }

  @UseGuards(SessionGuard)
  @Post('/:id/end')
  endSequence(@Req() request: Request, @Param('id') sequenceId: number) {
    return this.sequenceService.runLeaveProgram(
      sequenceId,
      request.user as User,
    );
  }
}
