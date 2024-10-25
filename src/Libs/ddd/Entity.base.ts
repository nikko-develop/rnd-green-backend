import { ArgumentInvalidException, ArgumentNotProvidedException } from '@Libs/Exceptions';
import { Guard } from '@Libs/Guard';
import { convertPropsToObject } from '@Libs/Utils';

export type AggregateID = string;

export interface BaseEntityProps {
	id: AggregateID;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateEntityProps<T> {
	id: AggregateID;
	props: T;
	createdAt?: Date;
	updatedAt?: Date;
}

export abstract class Entity<EntityProps> {
	protected readonly props: EntityProps;
	protected readonly _id: AggregateID;
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	public constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<EntityProps>) {
		this.validateProps(props);

		const now = new Date(Date.now());
		this._id = id;
		this._createdAt = createdAt ?? now;
		this._updatedAt = updatedAt ?? now;
		this.props = props;

		this.validate();
	}

	public get id(): AggregateID {
		return this._id;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}

	public get updatedAt(): Date {
		return this._updatedAt;
	}

	public static isEntity(entity: unknown): entity is Entity<unknown> {
		return entity instanceof Entity;
	}

	public equals(object?: Entity<EntityProps>): boolean {
		if (object === undefined) {
			return false;
		}

		if (this === object) {
			return true;
		}

		if (!Entity.isEntity(object)) {
			return false;
		}

		return this.id ? this.id === object.id : false;
	}

	public getPropsCopy(): BaseEntityProps & EntityProps {
		const propsCopy = {
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...this.props
		};

		return Object.freeze(propsCopy);
	}
	public toObject(): unknown {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const plainProps = convertPropsToObject(this.props);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const result = {
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...plainProps
		};

		return Object.freeze(result);
	}

	public abstract validate(): void;

	protected validateProps(props: EntityProps): void {
		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException('Entity props should not be empty');
		}

		if (typeof props !== 'object') {
			throw new ArgumentInvalidException('Entity props should be an object');
		}
	}
}
