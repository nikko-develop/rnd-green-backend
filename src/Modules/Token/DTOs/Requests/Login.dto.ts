import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({ description: 'LDAP логин пользователя', example: 'rovezov' })
	@IsString()
	public login: string;

	@ApiProperty({ description: 'Пароль пользователя', example: 'qwerty123' })
	@IsString()
	public password: string;
}
