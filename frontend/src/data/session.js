import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'
import { userResource } from './user'
import router from '@/router'
import { ref, computed } from 'vue'

export const sessionStore = defineStore('erp-session', () => {
  function sessionUser() {
    let cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
    let _sessionUser = cookies.get('user_id')
    if (_sessionUser === 'Guest') {
      _sessionUser = null
    }
    return _sessionUser
  }

  let user = ref(sessionUser())
  const isLoggedIn = computed(() => !!user.value)
  const roles = ref([])
  const employee = ref({})

  async function hydrateFromResource() {
    if (userResource.data) {
      roles.value = userResource.data.roles || []
      employee.value = userResource.data.employee || {}
    }
  }

  const login = createResource({
    url: 'login',
    method: 'POST',
    makeParams({ email, password }) {
      return {
        usr: email,
        pwd: password,
      }
    },
    async onSuccess() {
      await hydrateFromResource()
      user.value = sessionUser()
      await userResource.reload()
      login.reset()
      router.replace({ path: '/' })
    },
  })

  const logout = createResource({
    url: 'logout',
    onSuccess() {
      userResource.reset()
      roles.value = []
      employee.value = {}
      user.value = null
      router.replace({ name: 'Login' })
    },
  })

  // hydrate on store creation (refresh case)
  userResource.fetch().then(() => {
    hydrateFromResource()
  }).catch(() => {
    user.value = null
    roles.value = []
    employee.value = {}
  })

  return {
    user,
    isLoggedIn,
    login,
    logout,
    roles,
    employee,
  }
})

