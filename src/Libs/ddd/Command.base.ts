import { ulid } from 'ulid';

import { RequestContextService } from '@Libs/Application/AppRequestContext';
import { ArgumentNotProvidedException } from '@Libs/Exceptions';
import { Guard } from '@Libs/Guard';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> & Partial<Command>;

export class Command {
	public readonly id: string;

	public readonly correlationId: string;

	public readonly causationId?: string;

	public constructor(props: CommandProps<unknown>) {
		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException('Command props should not be empty.');
		}

		const ctx = RequestContextService.getContext();
		this.correlationId = props.correlationId ?? ctx.requestId;
		this.id = props.id ?? ulid();
	}
}
