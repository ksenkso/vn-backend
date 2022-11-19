import { BadRequestException } from '@nestjs/common';

export class NodeAlreadyLinkedException extends BadRequestException {
  static between(fromId: number, toId: number) {
    return new NodeAlreadyLinkedException(null, `Node ${fromId} is already linked to node ${toId}`);
  }
}
