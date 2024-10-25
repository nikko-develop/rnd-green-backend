import { ulid } from 'ulid';

import { RequestContextService } from '@Libs/Application/AppRequestContext';
import { ArgumentNotProvidedException } from '@Libs/Exceptions';
import { Guard } from '@Libs/Guard';

type DomainEventMetadata = {
	readonly timestamp: number;
	readonly correlationId: string;
	readonly causationId?: string;
	readonly userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
	aggregateId: string;
	metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
	public readonly id: string;

	public readonly aggregateId: string;

	public readonly metadata?: DomainEventMetadata;

	public constructor(props: DomainEventProps<unknown>) {
		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException('DomainEvent props should not be empty.');
		}
		this.id = ulid();
		this.aggregateId = props.aggregateId;
		this.metadata = {
			correlationId: props.metadata?.correlationId || RequestContextService.getRequestId(),
			causationId: props.metadata?.causationId,
			timestamp: props.metadata?.timestamp || Date.now(),
			userId: props.metadata?.userId
		};
	}
}
