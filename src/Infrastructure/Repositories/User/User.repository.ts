import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Model } from 'mongoose';
import { UserAggregate } from '@Entities/User/Domain/User.entity';
import { UserRepositoryPort } from '@Entities/User/Port/User.repository.port';
import { MongoRepository } from '@Infrastructure/MongoDB/Mongo.repository';
import { UserMapper } from '@Infrastructure/Repositories/User/User.mapper';
import { UserRecord, UserDocument } from '@Infrastructure/Repositories/User/User.schema';
import { NotFoundException } from '@Libs/Exceptions';
import { ObjectLiteral } from '@Libs/types/ObjectLiteral.type';
import { ULID } from '@Libs/types/ULID.type';
import {
	FindManyUsersDto,
	FindManyUsersFilterDto
} from '@Modules/User/DTOs/Requests/User.findMany.dto';

@Injectable()
export class UserRepository
	extends MongoRepository<UserAggregate, UserRecord>
	implements UserRepositoryPort
{
	protected readonly logger = new Logger(UserRepository.name);

	public constructor(
		protected readonly mapper: UserMapper,
		@InjectModel(UserRecord.name) protected readonly model: Model<UserDocument>
	) {
		super(mapper);
	}

	public async save(entity: UserAggregate): Promise<void> {
		const persistence = this.mapper.toPersistence(entity);
		await this.model.findOneAndUpdate(
			{ id: entity.id },
			{ ...persistence, updatedAt: new Date() },
			{ upsert: true }
		);
	}

	public async findById(id: ULID): Promise<UserAggregate> {
		return Promise.resolve(this.findOneByFilter({ id }));
	}
	public async findByLogin(login: string): Promise<UserAggregate> {
		return Promise.resolve(this.findOneByFilter({ login }));
	}
	public async existsById(id: ULID): Promise<boolean> {
		return this.existsByFilter({ id });
	}
	public async existsByLogin(login: string): Promise<boolean> {
		return this.existsByFilter({ login });
	}
	private async existsByFilter(filter: ObjectLiteral): Promise<boolean> {
		const userRecord = await this.model.findOne(filter).lean();
		return Boolean(userRecord);
	}
	public async findMany(query: FindManyUsersDto): Promise<UserAggregate[]> {
		const users = await this.findManyByFilter({ ...this.processQueryFilter(query) });
		if (query.page && query.perPage) {
			return this.sliceUsersForPagination(users, query.page, query.perPage);
		}
		return users;
	}
	private processQueryFilter(query: FindManyUsersDto): FindManyUsersFilterDto {
		if (query.filter && Object.keys(query.filter).length > 0) {
			return { ...query.filter };
		}
		return {};
	}
	private sliceUsersForPagination(
		users: UserAggregate[],
		page: number,
		perPage: number
	): UserAggregate[] {
		const offset = (page - 1) * perPage;

		return users.slice(offset, offset + perPage);
	}
	private async findOneByFilter(filter: ObjectLiteral): Promise<UserAggregate> {
		const userRecord = await this.model.findOne(filter).lean();
		if (!userRecord) throw new NotFoundException('Пользователь не найден');

		return this.mapper.toDomain(userRecord);
	}
	private async findManyByFilter(filter: ObjectLiteral): Promise<UserAggregate[]> {
		const userRecords = await this.model.find(filter).lean();
		const users = userRecords.map(this.mapper.toDomain.bind(this));

		return users;
	}
}
