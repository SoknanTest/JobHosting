import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Error message' })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error?: string;
}
