import { Body, Controller, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/action.dto';
import { ActionPipe } from '../action.pipe';

@Controller('action')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post()
  create(@Body(ActionPipe) actionDto: CreateActionDto) {
    return this.actionService.create(actionDto);
  }

  @Post('/:id/execute')
  execute(@Param('id') id: number, @Body('userId') userId: number) {
    return this.actionService.execute(id, userId);
  }
}
