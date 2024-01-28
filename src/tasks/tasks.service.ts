import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.findAll(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    // return this.tasksRepository.findById(id);
    return this.tasksRepository.findOne({ where: { id, user } });
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string): Promise<void> {
    return this.tasksRepository.deleteById(id);
  }

  // async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    // const task = await this.getTaskById(id);
    // task.status = status;
    // await this.tasksReponsitory.save(task);


    // return this.tasksRepository.updateTaskStatus(id, status);
  // }
}
