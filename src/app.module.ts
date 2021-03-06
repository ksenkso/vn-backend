import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { StoryModule } from './story/story.module';
import { SequenceModule } from './sequence/sequence.module';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './seed/users/command';
import { ChoiceModule } from './choice/choice.module';
import { StateModule } from './state/state.module';
import { RouterModule } from './router/router.module';
import { NodeModule } from './node/node.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    UsersModule,
    StoryModule,
    SequenceModule,
    CommandModule,
    ChoiceModule,
    StateModule,
    RouterModule,
    NodeModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserCommand],
})
export class AppModule {}
