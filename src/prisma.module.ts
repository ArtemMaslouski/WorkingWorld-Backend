import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // делает модуль доступным глобально, можно опустить imports в других модулях
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
