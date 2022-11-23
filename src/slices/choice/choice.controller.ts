import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { CreateChoiceDto } from './dto/choice.dto';
import { Request } from 'express';
import { User } from '../../entity/user.entity';
import { SessionGuard } from '../../auth/session.guard';

@Controller('choice')
export class ChoiceController {
  constructor(private choiceService: ChoiceService) {}

  @Get()
  get(@Param('id') id: number) {
    return this.choiceService.get(id);
  }

  @Post()
  create(@Body() choiceDto: CreateChoiceDto) {
    return this.choiceService.create(choiceDto);
  }

  @UseGuards(SessionGuard)
  @Post('/:choiceId')
  createPlayerChoice(
    @Req() request: Request,
    @Param('choiceId') choiceId: number,
    @Body('optionId') optionId: number,
  ) {
    return this.choiceService.createPlayerChoice(
      (request.user as User).id,
      choiceId,
      optionId,
    );
  }
}
