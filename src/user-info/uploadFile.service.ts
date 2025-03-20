import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  private uploadPath = join(__dirname, '..', '..', 'uploads');

  async uploadFile(file: Express.Multer.File): Promise<string> {
    await mkdir(this.uploadPath, { recursive: true });

    const filePath = join(this.uploadPath, file.originalname);
    await writeFile(filePath, file.buffer);

    return `/uploads/${file.originalname}`;
  }
}
