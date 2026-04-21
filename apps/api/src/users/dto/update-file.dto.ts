import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty({ example: 'https://cloudinary.com/image.jpg' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}
