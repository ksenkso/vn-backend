import { FindOptionsWhere, Repository } from 'typeorm';
import { EntityNotFoundException } from '../exceptions/EntityNotFoundException';
import { EntityAlreadyExistsException } from '../exceptions/EntityAlreadyExistsException';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export class DtoValidator<Entity extends { id: number | string }> {
  constructor(private repo: Repository<Entity>) {
  }

  async requireOne(id: number | string) {
    const entity = await this.repo.findOneBy({ id } as FindOptionsWhere<Entity>);

    if (!entity) {
      throw EntityNotFoundException.withId(this.repo.metadata.name, id);
    }

    return entity;
  }

  async requireAbsent(id: number | string) {
    const entity = await this.repo.findOneBy({ id } as FindOptionsWhere<Entity>);

    if (entity) {
      throw EntityAlreadyExistsException.withId(this.repo.metadata.name, id);
    }
  }

  async existsWhere(where?: FindOneOptions<Entity>['where']) {
    const entity = await this.repo.findOne({ where });

    if (!entity) {
      throw EntityNotFoundException.withParams(this.repo.metadata.name, JSON.stringify(where));
    }

    return entity;
  }

  async notExistsWhere(where?: FindOneOptions<Entity>['where']) {
    const entity = await this.repo.findOne({ where });

    if (entity) {
      throw EntityAlreadyExistsException.withParams(this.repo.metadata.name, JSON.stringify(where));
    }
  }

}

export interface IDtoValidator<CreateDto, UpdateDto> {
  validateCreate(dto: CreateDto, extra?: unknown): Promise<void>;

  validateUpdate(dto: UpdateDto, extra?: unknown): Promise<void>;
}
