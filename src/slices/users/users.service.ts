import { Injectable } from '@nestjs/common';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.users.find();
  }

  async findOne(username: string) {
    return this.users.findOne({
      where: {
        username,
      },
      relations: ['roles'],
    });
  }

  async create(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = await User.hashPassword(password);
    return this.users.save(user);
  }

  async delete(username: string): Promise<any> {
    return this.users.delete({
      username,
    });
  }

  async updateByName(body: Record<string, any>) {
    const user = await this.findOne(body.username);
    if (user) {
      user.username = body.newName;
      user.password = body.password;
      return this.users.save(user);
    }
  }

  /**
   * TODO: real ownership check.
   * We can implement this by checking relations between tables in a DB,
   * or define a relation to a user in each model
   * (two ways: define a FK or just a path for a join)
   * @param user
   * @param models
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkOwnership(user: User, models: any[]) {
    return true;
  }
}
