import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationBase {
  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  public page?: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsOptional()
  public perPage?: number;
}
