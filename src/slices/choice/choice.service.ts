import { Injectable } from '@nestjs/common';
import { CreateChoiceDto, CreateChoiceOptionDto } from './dto/choice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sequence } from '../../entity/Sequence';
import { Repository } from 'typeorm';
import { Choice } from '../../entity/Choice';
import { ChoiceOption } from '../../entity/ChoiceOption';
import { PlayerChoice } from '../../entity/PlayerChoice';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(Choice)
    private choices: Repository<Choice>,
    @InjectRepository(ChoiceOption)
    private choiceOptions: Repository<ChoiceOption>,
    @InjectRepository(PlayerChoice)
    private playerChoices: Repository<PlayerChoice>,
  ) {}

  async create(choiceDto: CreateChoiceDto) {
    const choice = this.choices.create(choiceDto);
    const createdChoice = await this.choices.save(choice);
    await this.sequences.update(choiceDto.sequenceId, {
      choiceId: createdChoice.id,
    });

    if (choiceDto.options) {
      choiceDto.options.forEach((option: CreateChoiceOptionDto) => {
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

  async createPlayerChoice(userId: number, choiceId: number, optionId: number) {
    const playerChoice = this.playerChoices.create({
      userId,
      choiceId,
      optionId,
    });
    playerChoice.userId = userId;

    return this.playerChoices.save(playerChoice);
  }

  get(id: number) {
    return this.choices.findOne(id);
  }
}
