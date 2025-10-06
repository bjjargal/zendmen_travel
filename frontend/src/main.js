import './index.css'

import { createApp } from 'vue'
import { dayjs } from '@/utils'
import App from './App.vue'
import Antd from 'ant-design-vue'
import { ConfigProvider } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia'
import {
  setConfig,
  frappeRequest,
  resourcesPlugin,
  FeatherIcon
} from 'frappe-ui'
import router from './router'



let pinia = createPinia()
let app = createApp(App)
setConfig('resourceFetcher', frappeRequest)
app.component('ConfigProvider', ConfigProvider)
app.config.globalProperties.$dayjs = dayjs
app.component('FeatherIcon', FeatherIcon)
app.use(resourcesPlugin)
app.use(Antd)
app.use(pinia)
app.use(router)


app.mount('#app')

