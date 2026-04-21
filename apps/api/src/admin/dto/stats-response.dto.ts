import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty()
  users!: number;

  @ApiProperty()
  jobs!: number;

  @ApiProperty()
  applications!: number;
}
