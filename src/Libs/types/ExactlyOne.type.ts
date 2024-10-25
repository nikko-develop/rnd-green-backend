import { AtLeastOne } from '@Libs/types/AtLeastOne.type';
import { AtMostOne } from '@Libs/types/AtMostOne.type';

export type ExactlyOne<T> = AtLeastOne<T> & AtMostOne<T>;
