import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
