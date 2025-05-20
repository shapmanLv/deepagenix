import { createLocalInstance } from '@/lib/localstorage'

/** token */
export const localAccessToken = createLocalInstance('access-token')

/**  token */
export const localRefreshToken = createLocalInstance('refresh-token')
