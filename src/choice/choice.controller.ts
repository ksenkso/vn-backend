import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { CreateChoiceDto } from './dto/choice.dto';
import { Request } from 'express';
import { User } from '../entity/user.entity';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('choice')
export class ChoiceController {
  constructor(private choiceService: ChoiceService) {}

  @Post()
  create(@Body() choiceDto: CreateChoiceDto) {
    return this.choiceService.create(choiceDto);
  }

  @UseGuards(JwtGuard)
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
