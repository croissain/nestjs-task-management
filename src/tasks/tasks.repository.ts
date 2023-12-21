import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findAll(
    { search, status }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async findById(id: string): Promise<Task> {
    const found = await this.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  async deleteById(id: string): Promise<void> {
    this.delete({ id: id });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    await this.update(id, { status });
    return await this.findById(id);
  }
}
