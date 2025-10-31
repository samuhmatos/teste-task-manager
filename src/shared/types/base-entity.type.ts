export type BaseEntity<Entity> = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type BaseUpdateEntity<Entity> = Partial<BaseEntity<Entity>>;
