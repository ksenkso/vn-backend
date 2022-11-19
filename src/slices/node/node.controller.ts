import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateNodeDto, UnlinkNodesDto } from 'src/slices/sequence/dto/sequence-node.dto';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private nodeService: NodeService) {}

  @Get('/:id')
  get(@Param('id') id: number) {
    return this.nodeService.get(id);
  }

  @Get('/list/:id')
  getList(@Param('id') id: number) {
    return this.nodeService.getList(id);
  }

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Patch('/unlink')
  unlink(@Body() unlinkNodesDto: UnlinkNodesDto) {
    return this.nodeService.unlink(unlinkNodesDto);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.update(id, createNodeDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.nodeService.delete(id);
  }
}
