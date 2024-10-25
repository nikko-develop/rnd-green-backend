import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationBase } from '@Libs/API/Pagination.base.dto';

export class FindManyUsersFilterDto {
	@ApiProperty({ description: 'Имя пользователя', example: 'Название' })
	@IsOptional()
	public name?: string;

	@ApiProperty({ description: 'Логин пользователя', example: 'example' })
	@IsOptional()
	public login?: string;
}
export class FindManyUsersDto extends PaginationBase {
	@ApiProperty({ description: 'Фильтр поиска' })
	@IsOptional()
	public filter?: FindManyUsersFilterDto;
}
