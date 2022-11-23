import * as bcrypt from 'bcrypt';
import { Role } from './role.entiity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayerState } from './PlayerState';
import { PlayerChoice } from './PlayerChoice';
import { RefreshToken } from './RefreshToken';

export interface IUser {
  id: number;
  username: string;
  password: string;
  roles: Role[];
  states: PlayerState[];
  playerChoices: PlayerChoice[];
  refreshTokens: RefreshToken[];

  updatePassword(...args: any): Promise<void>;

  comparePassword(password): Promise<any>;

  withoutPassword(): { roles: any; id: any; username: any };
}

export interface SessionStoredUser {
  id: number;
  username: string;
  roles: string[];
}

@Entity()
export class User implements IUser {
  static async hashPassword(password: string) {
    if (!password) {
      throw new Error('Password shouldn\'t be an empty string.');
    } else {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    }
  }

  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;

  @Column() password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => PlayerState, (state) => state.user) states: PlayerState[];

  @OneToMany(() => PlayerChoice, (playerChoice) => playerChoice.user)
  playerChoices: PlayerChoice[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @BeforeUpdate()
  async updatePassword(...args: any) {
    console.log('UPDATE!!!');
    console.log(args);
  }

  async comparePassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      console.error(JSON.stringify(e));
      return false;
    }
  }

  withoutPassword(): SessionStoredUser {
    return {
      id: this.id,
      username: this.username,
      roles: this.roles.map(role => role.name),
    };
  }
}
