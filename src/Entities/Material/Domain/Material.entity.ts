import { Entity } from '@Libs/ddd/Entity.base';
import { MaterialProps } from './Material.types';
import { ulid } from 'ulid';

export class MaterialEntity extends Entity<MaterialProps> {
	public static create(create: MaterialProps, id?: string, created?: Date, updated?: Date) {
		const newId = id ? id : ulid();
		const now = new Date(Date.now());
		const newCreated = created ?? now;
		const newUpdated = updated ?? now;
		const props: MaterialProps = { ...create };

		return new MaterialEntity({
			id: newId,
			createdAt: newCreated,
			updatedAt: newUpdated,
			props: props
		});
	}
	public validate(): void {}
}
