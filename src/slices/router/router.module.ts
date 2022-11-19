import { Module } from '@nestjs/common';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterNode } from '../../entity/RouterNode';
import { RouteCondition } from '../../entity/RouteCondition';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { PlayerState } from '../../entity/PlayerState';
import { Sequence } from '../../entity/Sequence';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RouterNode,
      RouteCondition,
      PlayerChoice,
      PlayerState,
      Sequence,
    ]),
  ],
  controllers: [RouterController],
  providers: [RouterService],
})
export class RouterModule {}
