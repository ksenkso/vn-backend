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
import { User } from '../entity/user.entity';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('sequence')
export class SequenceController {
  constructor(private sequenceService: SequenceService) {}

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
    return this.sequenceService.create(sequenceDto);
  }

  @Patch('/:id')
  update(
    @Param('id') sequenceId: number,
    @Body(ProgramPipe) sequenceDto: UpdateSequenceDto,
  ) {
    return this.sequenceService.update(sequenceId, sequenceDto);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/end')
  endSequence(@Req() request: Request, @Param('id') sequenceId: number) {
    return this.sequenceService.runLeaveProgram(
      sequenceId,
      request.user as User,
    );
  }
}
