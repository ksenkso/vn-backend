import { Controller } from '@nestjs/common';
import { ChoiceService } from './choice.service';

@Controller('choice')
export class ChoiceController {
  constructor(private choiceService: ChoiceService) {}
}
