import { ULID } from '@Libs/types/ULID.type';

export interface RefreshTokenProps {
	userId: ULID;
	hash?: string;
}
