import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { TasksRepository } from './tasks/tasks.repository';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { UsersRepository } from './auth/users.repository';

@Module({
  imports: [
    TasksModule,
    AuthModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Task, User],
    }),
    
    TypeOrmExModule.forCustomRepository([TasksRepository, UsersRepository]),
  ],
})
export class AppModule {}
