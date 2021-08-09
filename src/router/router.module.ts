import { Module } from '@nestjs/common';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterNode } from '../entity/RouterNode';
import { RouteCondition } from '../entity/RouteCondition';

@Module({
  imports: [TypeOrmModule.forFeature([RouterNode, RouteCondition])],
  controllers: [RouterController],
  providers: [RouterService],
})
export class RouterModule {}
