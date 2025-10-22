<template>
    <a-page-header class="!p-0 !mb-2" title="Guide" @back="() => $router.go(-1)">
        <template #extra>
            <a-button v-if="session.roles.includes('System Manager')" type="primary" @click="open = true">Create
                employee</a-button>
        </template>
    </a-page-header>
    <div class="w-full mt-4">
        <a-spin :spinning="employees?.list.loading">
            <a-empty v-if="!employees?.data || employees?.data.length === 0" description="No employees available" />
            <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <a-card v-for="employee in employees?.data" :key="employee.name" hoverable
                    @click="router.push({ name: 'employee', params: { name: employee.name } })">
                    <template #cover>
                        <img v-if="employee.image" class="h-64 sm:h-72 md:h-80 w-full object-cover" alt="Guide image"
                            :src="employee.image" />
                        <FeatherIcon name="user" class="size-64" />
                    </template>
                    <a-card-meta :title="`${employee.last_name} ${employee.first_name}`">
                        <template #description>
                            <div class="flex flex-col gap-1 text-gray-800">
                                <div class="flex items-center gap-2">
                                    <FeatherIcon name="mail" class="size-4 text-gray-500" />
                                    <span class="truncate">{{ employee.email }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <FeatherIcon name="phone" class="size-4 text-gray-500" />
                                    <span>{{ employee?.phone || "—" }}</span>
                                </div>
                            </div>
                        </template>
                    </a-card-meta>
                </a-card>
            </div>
        </a-spin>
    </div>
    <a-modal title="New employee" v-model:open="open" okText="Create employee" @ok="handleOk">
        <a-form ref="formRef" layout="vertical" :model="newEmployee" :rules="rules">
            <a-form-item label="First name" name="first_name">
                <a-input v-model:value="newEmployee.first_name" />
            </a-form-item>

            <a-form-item label="Last name" name="last_name">
                <a-input v-model:value="newEmployee.last_name" />
            </a-form-item>

            <a-form-item label="Email" name="email">
                <a-input v-model:value="newEmployee.email" />
            </a-form-item>

            <a-form-item label="Phone" name="phone">
                <a-input v-model:value="newEmployee.phone" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { EmployeeStore } from '@/data/Employee';
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import { sessionStore } from '@/data/session'
const session = sessionStore()

const { employees } = EmployeeStore()

const router = useRouter()
const open = ref(false)
const formRef = ref()
const rules = {
    email: [
        {
            required: true,
            message: 'Please enter an email',
            trigger: 'blur'
        },
        {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
            trigger: 'blur'
        }
    ]
}

const newEmployee = reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
})

const CreateEmployee = async () => {
    try {
        await employees.insert.submit({ ...newEmployee })
    }
    catch (error) {
        message.error(error.message || 'Error on creating employee', 2)
    }
    finally {
        resetNewEmployee()
        open.value = false
    }
}

const handleOk = () => {
    formRef.value.validate().then(async () => {
        try {
            await employees.insert.submit({ ...newEmployee })
            message.success('successfuly created new employee', 2)
            open.value = false
            resetNewEmployee()
        } catch (error) {
            message.error(error?.message || 'Error creating employee', 2)
        }
    }).catch(() => {
        message.warning('Please fill all fields')
    })
}

function resetNewEmployee() {
    Object.assign(newEmployee, {
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    })
}

</script>