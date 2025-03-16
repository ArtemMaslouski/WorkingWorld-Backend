import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { UserInfoController } from './user-info.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UserInfoService, PrismaService],
  controllers: [UserInfoController],
})
export class UserInfoModule {}
