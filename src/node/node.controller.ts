import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateNodeDto } from 'src/sequence/dto/sequence-node.dto';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.update(id, createNodeDto);
  }
}
