import { createLocalInstance } from '@/lib/localstorage'

/** accessToken */
export const localAccessToken = createLocalInstance('access-token')

/** refreshToken */
export const localRefreshToken = createLocalInstance('refresh-token')

/** expiresAtUtc */
export const localExpiresAtUtc = createLocalInstance('expires-at-utc')
