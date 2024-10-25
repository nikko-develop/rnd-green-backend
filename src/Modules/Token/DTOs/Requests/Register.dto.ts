import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
	@ApiProperty({ description: 'Имя пользователя', example: 'Николай Ковалёв' })
	@IsString()
	public name: string;

	@ApiProperty({ description: 'Логин пользователя', example: 'nkovalev' })
	@IsString()
	public login: string;

	@ApiProperty({ description: 'Пароль пользователя', example: 'qwerty123' })
	@IsString()
	public password: string;
}
