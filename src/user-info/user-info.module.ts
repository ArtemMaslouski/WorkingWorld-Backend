import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { UserInfoController } from './user-info.controller';
import { PrismaService } from '../prisma.service';
import { UploadService } from './uploadFile.service';

@Module({
  providers: [UserInfoService, PrismaService, UploadService],
  controllers: [UserInfoController],
})
export class UserInfoModule {}
