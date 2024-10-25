import { ArgumentNotProvidedException } from '@Libs/Exceptions';
import { Guard } from '@Libs/Guard';
import { convertPropsToObject } from '@Libs/Utils';

type Primitives = boolean | number | string;
interface DomainPrimitive<T extends Date | Primitives> {
	value: T;
}

export type ValueObjectProps<T> = T extends Date | Primitives ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
	protected readonly props: ValueObjectProps<T>;

	public constructor(props: ValueObjectProps<T>) {
		this.validate(props);
		this.props = props;
	}

	protected abstract validate(props: ValueObjectProps<T>): void;

	public static isValueObject(obj: unknown): obj is ValueObject<unknown> {
		return obj instanceof ValueObject;
	}

	public equals(vo?: ValueObject<T>): boolean {
		if (vo === undefined) {
			return false;
		}

		return JSON.stringify(this) === JSON.stringify(vo);
	}

	public unpack(): T {
		if (this.isDomainPrimitive(this.props)) {
			return this.props.value;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const propsCopy = convertPropsToObject(this.props);

		return propsCopy as T;
	}
	private checkIfEmpty(props: ValueObjectProps<T>): void {
		if (Guard.isEmpty(props) || (this.isDomainPrimitive(props) && Guard.isEmpty(props.value))) {
			throw new ArgumentNotProvidedException('Value object property cannot be empty');
		}
	}

	private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Date | Primitives)> {
		return Boolean(Object.prototype.hasOwnProperty.call(obj, 'value'));
	}
}
