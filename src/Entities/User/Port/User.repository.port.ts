import { UserAggregate } from '@Entities/User/Domain/User.entity';
import { ReadRepositoryPort } from '@Libs/Ports/ReadRepositoryPort.base';
import { ULID } from '@Libs/types/ULID.type';
import { FindManyUsersDto } from '@Modules/User/DTOs/Requests/User.findMany.dto';

export interface UserRepositoryPort extends ReadRepositoryPort<UserAggregate> {
	save(entity: UserAggregate): Promise<void>;
	delete(entity: UserAggregate): Promise<boolean>;
	findById(id: ULID): Promise<UserAggregate>;
	findByLogin(login: string): Promise<UserAggregate>;
	findMany(query: FindManyUsersDto): Promise<UserAggregate[]>;
	existsById(id: ULID): Promise<boolean>;
	existsByLogin(login: string): Promise<boolean>;
}
