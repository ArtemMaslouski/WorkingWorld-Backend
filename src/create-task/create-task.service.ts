import { Body, Injectable } from '@nestjs/common';
import { createTaskDTO } from './DTO/create-task-DTO';
import { PrismaService } from '../prisma.service';
import { deleteTaskDTO } from './DTO/delete-task-DTO';
import { UserInfoService } from 'src/user-info/user-info.service';

@Injectable()
export class CreateTaskService {
  constructor(
    private prisma: PrismaService,
    private userInfoService: UserInfoService,
  ) {}

  async createTask(@Body() createTaskDTO: createTaskDTO, token: string) {
    const { sub: userID } = this.userInfoService.verifyUser(token);
    const {
      Category,
      Subcategory,
      Address,
      AddressEnd,
      BeginAt,
      EndAt,
      Description,
    } = createTaskDTO;
    return this.prisma.task.create({
      data: {
        Category: Category,
        Subcategory: Subcategory,
        Address: Address,
        AddressEnd: AddressEnd,
        BeginAt: BeginAt,
        EndAt: EndAt,
        Description: Description,
        UserId: +userID,
      },
    });
  }

  async getTasks() {
    return await this.prisma.task.findMany();
  }

  async deleteTask(@Body() deleteDTO: deleteTaskDTO) {
    const { id } = deleteDTO;

    return await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  async resetTaskData(id: number, resetData: createTaskDTO) {
    const { Category, Subcategory, Address, BeginAt, EndAt, Description } =
      resetData;

    const task = await this.prisma.task.update({
      where: {
        id: id,
      },
      data: {
        Category,
        Subcategory,
        Address,
        BeginAt,
        EndAt,
        Description,
      },
    });

    if (!task) {
      throw new Error('Задания не существует');
    }

    return task;
  }

  async getUserTask(token: string) {
    const { sub: userId } = this.userInfoService.verifyUser(token);

    return await this.prisma.user.findMany({
      where: {
        id: +userId,
      },
      include: {
        userInfo: true,
        Task: true,
      },
    });
  }
}
