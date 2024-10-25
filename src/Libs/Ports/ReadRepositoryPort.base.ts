export class Paginated<T> {
  public readonly count: number;
  public readonly limit: number;
  public readonly page: number;
  public readonly data: readonly T[];

  public constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  page: number;
};
// eslint-disable-next-line
export interface ReadRepositoryPort<Entity> {
  findById(id: string): Promise<Entity>;
}
