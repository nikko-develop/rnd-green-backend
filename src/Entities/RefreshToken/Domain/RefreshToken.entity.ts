import { ulid } from 'ulid';
import { RefreshTokenProps } from './RefreshToken.types';
import { createStringHash } from '@Libs/Utils/createStringHash.util';
import { AggregateID, Entity } from '@Libs/ddd/Entity.base';

export class RefreshTokenEntity extends Entity<RefreshTokenProps> {
	public static create(
		create: RefreshTokenProps,
		id?: AggregateID,
		createdAt?: Date,
		updatedAt?: Date
	) {
		const newId = id ? id : ulid();
		const now = new Date(Date.now());
		const newCreatedAt = createdAt ?? now;
		const newUpdatedAt = updatedAt ?? now;
		const props: RefreshTokenProps = { ...create };

		return new RefreshTokenEntity({
			id: newId,
			createdAt: newCreatedAt,
			updatedAt: newUpdatedAt,
			props
		});
	}

	public setHashFromToken(token: string) {
		this.props.hash = createStringHash(token);
	}
	public validateHash(token: string) {
		return this.props.hash === createStringHash(token);
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public validate(): void {}
}
