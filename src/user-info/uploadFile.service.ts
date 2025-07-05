import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserInfoService } from './user-info.service';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private userInfoService: UserInfoService,
  ) {}
  private uploadPath = join(__dirname, '..', '..', 'uploads');

  async uploadFile(file: Express.Multer.File, token: string) {
    const { sub: userID } = this.userInfoService.verifyUser(token);
    await mkdir(this.uploadPath, { recursive: true });

    const filePath = join(this.uploadPath, file.originalname);
    await writeFile(filePath, file.buffer);

    // Создаем запись в Photo
    const photo = await this.prisma.photo.create({
      data: {
        Url: `/uploads/${file.originalname}`,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: {
        id: +userID,
      },
      data: {
        userInfo: {
          update: {
            Photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        },
      },
      include: {
        userInfo: {
          include: {
            Photo: true,
          },
        },
      },
    });
    return updatedUser;
  }
}
