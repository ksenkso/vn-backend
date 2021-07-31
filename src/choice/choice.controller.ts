import { Body, Controller, Post } from '@nestjs/common';
import { ChoiceCreateDto } from './dto/choice.dto';
import { ChoiceService } from './choice.service';

@Controller('choice')
export class ChoiceController {
  constructor(private choiceService: ChoiceService) {}

  @Post()
  create(@Body() choiceDto: ChoiceCreateDto) {
    return this.choiceService.create(choiceDto);
  }
}
