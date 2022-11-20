import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateNodeDto, DisconnectNodesDto } from 'src/slices/sequence/dto/sequence-node.dto';
import { NodeService } from './node.service';
import { DataSource } from 'typeorm';

@Controller('node')
export class NodeController {
  constructor(
    private nodeService: NodeService,
    private readonly ds: DataSource,
  ) {}

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
    return this.ds.transaction(manager => {
      return this.nodeService.withTransaction(manager).create(createNodeDto);
    })
  }

  @Patch('/disconnect')
  disconnectNodes(@Body() disconnectNodesDto: DisconnectNodesDto) {
    return this.ds.transaction(manager => {
      return this.nodeService
        .withTransaction(manager)
        .disconnectNodes(disconnectNodesDto);
    })
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() createNodeDto: CreateNodeDto) {
    return this.ds.transaction(manager => {
      return this.nodeService.withTransaction(manager).update(id, createNodeDto);
    })
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.ds.transaction(manager => {
      return this.nodeService.withTransaction(manager).delete(id);
    })
  }
}
