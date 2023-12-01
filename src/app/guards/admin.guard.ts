import { getDecodedAccessToken } from '../utils/tokenValidations';

export function adminGuard() {
  const token = sessionStorage.getItem('token_session');

  if (token !== null) {
    const decodedToken = getDecodedAccessToken(token);
    return 'username' in decodedToken.user;
  }
  return false;
}
