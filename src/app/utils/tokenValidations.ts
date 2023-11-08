import { jwtDecode } from 'jwt-decode';
import { DateTime, Settings } from 'luxon';
import { DecodedToken } from '../models/decodedToken';

export function getDecodedAccessToken(token: string): DecodedToken {
  const decodedToken: DecodedToken = jwtDecode(token);
  return decodedToken;
}

export function expirationTokenAuth(token: string): boolean {
  Settings.defaultZone = 'America/Buenos_Aires';
  Settings.defaultLocale = 'es';
  const { exp } = getDecodedAccessToken(token);
  const now = DateTime.now().toMillis();
  if (exp * 1000 <= now) sessionStorage.removeItem('token_session');
  return exp * 1000 <= now;
}
