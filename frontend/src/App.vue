<template>
  <a-style-provider hash-priority="high">
    <ConfigProvider>
      <router-view v-if="$route.name == 'Login'" />
      <Layout v-if="session.isLoggedIn"><router-view /></Layout>
    </ConfigProvider>
  </a-style-provider>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { sessionStore } from './data/session';

const session = sessionStore()
const DesktopLayout = defineAsyncComponent(() =>
  import('@/components/Layouts/DesktopLayout.vue')
)
const Layout = computed(() => {
  return DesktopLayout
})
</script>
<!-- :theme="{ token: { colorPrimary: '#D8C690' } }" -->