import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Choice } from '../entity/Choice';
import { Repository } from 'typeorm';
import { ChoiceOption } from '../entity/ChoiceOption';
import { ChoiceCreateDto, ChoiceOptionCreateDto } from './dto/choice.dto';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Choice)
    private choices: Repository<Choice>,

    @InjectRepository(ChoiceOption)
    private choiceOptions: Repository<ChoiceOption>,
  ) {}

  async create(choiceDto: ChoiceCreateDto) {
    const choice = this.choices.create(choiceDto);
    const createdChoice = await this.choices.save(choice);

    if (choiceDto.options) {
      choiceDto.options.forEach((option: ChoiceOptionCreateDto) => {
        option.choiceId = createdChoice.id;
      });
      let options = this.choiceOptions.create(choiceDto.options);
      options = await this.choiceOptions.save(options);

      return {
        ...createdChoice,
        options,
      };
    }

    return createdChoice;
  }
}
