import { Injectable } from '@nestjs/common';
import { UserAggregate } from '@Entities/User/Domain/User.entity';
import { UserRecord } from '@Infrastructure/Repositories/User/User.schema';
import { Mapper } from '@Libs/ddd/Mapper.interface';

@Injectable()
export class UserMapper implements Mapper<UserAggregate, UserRecord> {
	public toPersistence(entity: UserAggregate): UserRecord {
		const propsCopy = entity.getPropsCopy();
		return {
			id: entity.id,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			name: propsCopy.name,
			login: propsCopy.login,
			contactData: propsCopy.contactData,
			passwordHash: propsCopy.passwordHash
		};
	}

	public toDomain(record: UserRecord): UserAggregate {
		return UserAggregate.create(
			{
				name: record.name,
				login: record.login,
				contactData: record.contactData,
				passwordHash: record.passwordHash
			},
			record.id,
			record.createdAt,
			record.updatedAt
		);
	}
}
