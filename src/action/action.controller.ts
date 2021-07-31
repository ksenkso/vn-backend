import { Body, Controller, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/action.dto';

@Controller('action')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post()
  create(@Body() actionDto: CreateActionDto) {
    return this.actionService.create(actionDto);
  }
}
