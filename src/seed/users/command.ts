import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'seed:users',
    describe: 'create default users',
    autoExit: true, // defaults to `true`, but you can use `false` if you need more control
  })
  async create() {
    return this.userService.create('root', 'root');
  }
}
