<template>
    <a-dropdown :trigger="['hover']" placement="bottomRight" arrow>
        <a-button size="large" class="!flex  items-center gap-2 !py-6 " @click.prevent>
            <div>
                <a-avatar :src="image" class="size-10" />
            </div>
            <div>
                {{ fullName }}
            </div>
            <div>
                <FeatherIcon name="chevron-down" class="size-7" />
            </div>
        </a-button>
        <template #overlay>
            <a-menu>
                <a-menu-item v-if="session.roles.includes('HR Manager')" @click="openFrappe">
                    <span class="flex gap-2">
                        <FeatherIcon name="server" class="size-5" /> Frappe
                    </span>
                </a-menu-item>
                <a-menu-item @click="open = true">
                    <span class="flex gap-2">
                        <FeatherIcon name="lock" class="size-5" /> Нууц үг солих
                    </span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item class="!text-red-500 !flex " @click="session.logout.submit()">
                    <span class="flex gap-2">
                        <FeatherIcon name="log-out" class="size-5" /> Гарах
                    </span>

                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <a-modal cancelText="Хаах" okText="Хадгалах" v-model:open="open" title="Бүтэц" @ok="onOk">
        <a-form name="newPassword" layout="vertical">
            <a-form-item label="Шинэ нууц үг" :rules="[{ required: true, message: 'Нууц үг оруулна уу' }]">
                <a-input-password v-model:value="newPassword" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup>
import { FeatherIcon, createResource } from 'frappe-ui'
import { sessionStore } from '@//data/session';
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';

const session = sessionStore()
const image = computed(() => session.employee?.image || '')
const fullName = computed(() => {
    if (session.employee && session.employee.first_name) {
        return `${session.employee.last_name || ''} ${session.employee.first_name || ''}`.trim()
    }
    return session.user || 'Guest'
})

const open = ref(false)

const newPassword = ref('')

const onOk = () => createResource({
    url: 'erp.api.new_password',
    params: {
        new_password: newPassword.value
    },
    auto: true,
    onSuccess() {
        message.success({ content: 'Нууц үг амжилттай солигдлоо',duration:1 })
        open.value = false
    },
    onError() {
        message.error({ content: 'Нууц үг  солиход алдаа гарлаа',duration:1 })
    }
})



function openFrappe() {
    window.open('/app', '_blank') // open in new tab
}


</script>