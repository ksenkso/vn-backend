import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateNodeDto } from 'src/sequence/dto/sequence-node.dto';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get()
  get(@Param('id') id: number) {
    return this.nodeService.get(id);
  }

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.update(id, createNodeDto);
  }
}
