import { ULID } from '@Libs/types/ULID.type';

export type AccessToken = string;
export type RefreshToken = string;

export interface Tokens {
  refreshToken: AccessToken;
  accessToken: RefreshToken;
}

interface BaseTokenPayload<T> {
  serviceCode: string;
  serviceData: T;
}
export interface TokenPayload<T> extends BaseTokenPayload<T> {
  userId: ULID;
  user: {
    name: string;
    login: string;
  };
}

export interface ServiceTokenPayload<T> extends BaseTokenPayload<T> {
  tokenId: string;
  aud: string;
  issuedByUserId: ULID;
}

export const isServiceTokenPayload = <T>(
  token: ServiceTokenPayload<T> | TokenPayload<T>,
): token is ServiceTokenPayload<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (token as TokenPayload<T>).userId === undefined;
};
