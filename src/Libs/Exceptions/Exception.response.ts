import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExceptionCodes } from './Exception.codes';

type Constructor<I> = new (...args: unknown[]) => I;

class BaseExceptionResponseDto {
  @ApiProperty({ description: 'Код ошибки' })
  public code: string;

  @ApiProperty({ description: 'Время возникновения ошибки', example: '2022-12-22T13:26:00.000Z' })
  public timestamp: string;

  @ApiProperty({ description: 'Текст сообщения об ошибке' })
  public message: string;

  @ApiPropertyOptional({ description: 'Correlation ID', example: '01BX5ZZKBKACTAV9WEVGEMMVRY' })
  public correlationId?: string;

  @ApiPropertyOptional({ description: 'Причина исключения', type: String })
  public cause?: string;

  @ApiPropertyOptional({ description: 'Стек трейс ошибки', type: String })
  public stack?: string;

  @ApiPropertyOptional({ description: 'Опциональные метаданные' })
  public metadata?: unknown;
}

interface ExceptionResponseParams {
  code?: ExceptionCodes;
  message?: string;
  cause?: string;
  metadata?: unknown;
}

export const ExceptionResponse = (params: ExceptionResponseParams): Constructor<BaseExceptionResponseDto> => {
  class ApiError implements BaseExceptionResponseDto {
    @ApiProperty({ description: 'Код ошибки', example: params.code })
    public code: string;

    @ApiProperty({ description: 'Время возникновения ошибки', example: '2022-12-22T13:26:00.000Z' })
    public timestamp: string;

    @ApiProperty({ description: 'Текст сообщения об ошибке', example: params.message })
    public message: string;

    @ApiPropertyOptional({ description: 'Correlation ID', example: '01BX5ZZKBKACTAV9WEVGEMMVRY' })
    public correlationId: string;

    @ApiPropertyOptional({ description: 'Причина исключения', type: String, example: params.cause })
    public cause?: string;

    @ApiPropertyOptional({ description: 'Стек трейс ошибки', type: String })
    public stack?: string;

    @ApiPropertyOptional({ description: 'Опциональные метаданные', example: params.metadata })
    public metadata?: unknown;
  }
  return ApiError;
};
