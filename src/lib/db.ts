import { Repository } from 'typeorm';

export async function runInTransaction(repo: Repository<unknown>, fn: () => unknown) {
  const queryRunner = repo.manager.connection.createQueryRunner();

  await queryRunner.startTransaction();
  try {
    return await fn();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
