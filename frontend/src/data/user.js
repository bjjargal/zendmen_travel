import router from '@/router'
import { createResource } from 'frappe-ui'

export const userResource = createResource({
  url: 'zendmen_travel.api.get_logged_user',
  cache: 'User',
  transform(data) {
    return {
      user: data.user || 'Guest',
      roles: data.roles || [],
    }
  },
  onError(error) {
    if (error && error.exc_type === 'AuthenticationError') {
      router.push({ name: 'Login' })
    }
  },
})