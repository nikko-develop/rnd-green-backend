import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
	@ApiProperty({
		description: 'Всегда возвращает { message: "ok" }',
		example: 'ok'
	})
	public message: 'ok';
}
