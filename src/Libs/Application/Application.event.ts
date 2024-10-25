import { ulid } from 'ulid';

import { RequestContextService } from '@Libs/Application/AppRequestContext';
import { ArgumentNotProvidedException } from '@Libs/Exceptions';
import { Guard } from '@Libs/Guard';

type ApplicationEventMetadata = {
	readonly timestamp: number;
	readonly correlationId: string;
	readonly causationId: string;
};

export type ApplicationEventProps<T> = Omit<T, 'id' | 'metadata'> & {
	metadata?: ApplicationEventMetadata;
};

export abstract class ApplicationEvent {
	public readonly id: string;
	public readonly metadata: ApplicationEventMetadata;

	public constructor(props: ApplicationEventProps<unknown>) {
		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException('Application event props should not be empty.');
		}
		this.id = ulid();
		this.metadata = {
			correlationId: props.metadata?.correlationId ?? RequestContextService.getRequestId(),
			causationId: props.metadata?.causationId ?? '',
			timestamp: props.metadata?.timestamp ?? Date.now()
		};
	}
}
