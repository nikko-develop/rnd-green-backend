export interface WriteRepositoryPort<Entity> {
  insert(entity: Entity): Promise<string[]>;
  delete(entity: Entity): Promise<boolean>;
  update(entity: Entity): Promise<boolean>;
}
