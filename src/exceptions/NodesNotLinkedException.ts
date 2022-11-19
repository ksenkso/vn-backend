import { BadRequestException } from '@nestjs/common';
import { SequenceNode } from '../entity/SequenceNode';

export class NodesNotLinkedException extends BadRequestException {
  constructor(fromNode: SequenceNode, toNode: SequenceNode) {
    super(null, `Nodes with ids ${fromNode.id} and ${toNode.id} are not linked`);
  }
}
