import { Explode } from '@Libs/types/Explode.type';

export type AtMostOne<T> = Explode<Partial<T>>;
