<template>
  <div v-bind="$attrs"
    class="flex h-7 my-0.5 cursor-pointer items-center rounded hover:bg-gray-500 text-white duration-400 ease-in-out focus:outline-none focus:transition-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-400"
    :class="isActive ? 'bg-gray-700 shadow-sm' : ''">
    <div class="flex w-full items-center justify-between duration-300 ease-in-out px-2 py-1"
      :class="ischild ? 'border-b border-[#1627e7]' : ''" @click="handleClick">
      <div class="flex items-center truncate">
        <Tooltip :text="label" placement="right">
          <slot name="icon">
            <span class="grid flex-shrink-0 place-items-center ">
              <FeatherIcon v-if="typeof icon === 'string'" :name="icon" class="size-4" />
              <component v-else :is="icon" class="size-4 text-gray-700" />
            </span>
          </slot>
        </Tooltip>
        <Tooltip :text="label" placement="right" :hoverDelay="1.5">
          <span class="flex-1 flex-shrink-0 truncate text-sm duration-300 ease-in-out ml-2 w-auto opacity-100">
            {{ label }}
          </span>
        </Tooltip>
      </div>
      <span v-if="child.length > 0" @click.stop="isOpen = !isOpen" class="ml-1 transition-transform duration-300">
        <FeatherIcon name="chevron-down" class="h-4" :class="{ 'rotate-180': isOpen }" />
      </span>
    </div>
  </div>
  <Transition name="sidebar-slide" enter-active-class="transition-all duration-100 ease-in-out"
    leave-active-class="transition-all duration-100 ease-in-out">
    <nav v-if="isOpen" class="flex flex-col pl-6 overflow-hidden">
      <SidebarLink v-for="link in child" :key="link.label" :icon="null" :label="link.label" :to="link.to"
        :ischild="true" />
    </nav>
  </Transition>
</template>

<script setup>
import { Tooltip, FeatherIcon } from 'frappe-ui'
import { computed, useAttrs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import SidebarLink from '@/components/SidebarLink.vue'

const props = defineProps({
  icon: {
    type: [Object, String],
  },
  label: {
    type: String,
    default: '',
  },
  to: {
    type: [Object, String],
    default: '',
  },
  child: {
    type: Array,
    default: () => [],
  },
  ischild: {
    type: Boolean,
    default: false,
  },
})
const openKey = `sidebar-open-${props.label}`
const isOpen = useStorage(openKey, false)


const $attrs = useAttrs()
const router = useRouter()
const route = useRoute()
// const isOpen = ref(false)

function handleClick() {
  if (!props.to) return
  if (typeof props.to === 'object') {
    router.push(props.to)
  } else {
    router.push({ name: props.to })
  }
}

const isActive = computed(() => {
  if (!props.to) return false

  if (typeof props.to === 'string') {
    return route.name === props.to
  }

  if (typeof props.to === 'object') {
    // Match route name
    if (route.name !== props.to.name) return false

    // If there are route params, compare them
    if (props.to.params) {
      for (const key in props.to.params) {
        if (route.params[key] !== props.to.params[key]) return false
      }
    }

    // Optional: match query
    if (props.to.query) {
      for (const key in props.to.query) {
        if (route.query[key] !== props.to.query[key]) return false
      }
    }

    return true
  }

  return false
})

</script>

