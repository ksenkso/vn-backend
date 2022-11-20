import { Repository } from 'typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { CustomRepository } from '../../typeorm/typeorm-ex.decorator';

@CustomRepository(SequenceNode)
export class NodeRepository extends Repository<SequenceNode> {
  async getList(fromId: number): Promise<SequenceNode[]> {
    const sql = `WITH RECURSIVE traverse_list AS (
      SELECT sequence_node.*
      FROM sequence_node
      WHERE "sequence_node"."id" = $1
      UNION all
      SELECT
          sn.*
      FROM sequence_node sn
      JOIN traverse_list ON ("sn"."prevId" = "traverse_list"."id")
      )
      SELECT * FROM traverse_list;`

    return this.query(sql, [fromId]);
  }
}
