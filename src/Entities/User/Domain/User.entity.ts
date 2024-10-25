import _ from 'lodash';
import { ulid } from 'ulid';
import { UserContactData, UserProps } from '@Entities/User/Domain/User.types';
import { AggregateRoot } from '@Libs/ddd/AggregateRoot.base';
import { AggregateID } from '@Libs/ddd/Entity.base';

export class UserAggregate extends AggregateRoot<UserProps> {
	public static create(create: UserProps, id?: AggregateID, createdAt?: Date, updatedAt?: Date) {
		const newId = id ? id : ulid();
		const now = new Date(Date.now());
		const newCreatedAt = createdAt ?? now;
		const newUpdatedAt = updatedAt ?? now;
		const props: UserProps = { ...create };

		return new UserAggregate({
			id: newId,
			createdAt: newCreatedAt,
			updatedAt: newUpdatedAt,
			props
		});
	}
	public update(update: Partial<Pick<UserProps, 'name'>>): void {
		Object.assign(this.props, _.omitBy(_.pick(update, ['name']), _.isNil.bind(_)));
	}
	public updateContactData(contactData: UserContactData) {
		Object.assign(this.props.contactData, _.omitBy(contactData, _.isNil.bind(_)));
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public validate(): void {}
}
