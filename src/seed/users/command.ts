import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../slices/users/users.service';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'seed:users',
    describe: 'create default users',
  })
  async create() {
    return this.userService.create('root', 'root');
  }
}
