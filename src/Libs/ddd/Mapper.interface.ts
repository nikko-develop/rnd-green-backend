import { Entity } from '@Libs/ddd/Entity.base';

export interface Mapper<DomainEntity extends Entity<unknown>, DbRecord> {
	toPersistence(entity: DomainEntity): DbRecord;
	toDomain(record: DbRecord): DomainEntity;
}
