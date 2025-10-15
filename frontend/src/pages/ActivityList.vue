<template>
    <a-page-header class="!p-0 !mb-2" title="Activities">
        <template #extra>
            <a-button type="primary" @click="handleCreate">Create activity</a-button>
        </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="activities.data" size="small" :loading="activities.list.loading"
        :pagination="false" row-key="name" :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'cost'">
                <div>
                    ${{ record.cost }}
                </div>
            </template>
            <template v-if="column.key === 'Action'">
                <div class="editable-row-operations">
                    <div class="flex gap-2">
                        <a-button @click="edit(record.name)" type="primary" class="!flex justify-center items-center">
                            <template #icon>
                                <FeatherIcon name="edit" class="size-4" />
                            </template>
                        </a-button>
                        <a-button @click="deleteRecord(record.name)" type="primary"
                            class="!flex justify-center items-center" danger>
                            <template #icon>
                                <FeatherIcon name="trash-2" class="size-4" />
                            </template>
                        </a-button>
                    </div>
                </div>
            </template>
        </template>
    </a-table>
    <a-modal v-model:open="open" :title="isCreate ? 'Create Activity' : `Activity: ${formModel?.activity_name || ''}`"
        @ok="handleSave" :loading="saving" @cancel="handleCancel">
        <a-form :form="createFormRef" :model="formModel" :rules="formRules" layout="vertical">
            <a-form-item label="Activity Name" name="activity_name">
                <a-input v-model:value="formModel.activity_name" placeholder="Enter activity name" />
            </a-form-item>
            <a-form-item label="Cost" name="cost">
                <a-input-number v-model:value="formModel.cost" placeholder="Enter cost" class="!w-full" />
            </a-form-item>
            <a-form-item label="Description" name="description">
                <a-textarea v-model:value="formModel.description" placeholder="Enter cost" class="!w-full" />
            </a-form-item>
            <a-form-item label="Destinations" name="destinations">
                <a-select v-model:value="formModel.destinations" :options="destinationOptions" mode="multiple"
                    class="!w-full" placeholder="Please select" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from 'vue';
import { message } from 'ant-design-vue';
import { ActivityStore } from '@/data/Activities';
import { DestinationStore } from '@/data/destinations';
import { createDocumentResource } from 'frappe-ui'

const { destinations } = DestinationStore()
const destinationOptions = computed(() => {
    return destinations?.data?.map(d => ({
        value: d.name,
        label: d.destination_name
    })) || []
})

const { activities } = ActivityStore()
const open = ref(false)
const saving = ref(false)
const isCreate = ref(false)
const activityName = ref('')

const activity = createDocumentResource({
    doctype: 'Activity',
    name: activityName,
    auto: false
})

const createFormRef = ref(null)

const formModel = ref(null)

const formRules = {
    activity_name: [{ required: true, message: 'Please enter activity name' }],
    cost: [{ required: true, message: 'Please enter cost' }, { type: 'number', min: 0, message: 'Cost must be at least 0' }],
    destinations: [{ required: true, type: 'array', min: 1, message: 'Please select at least one destination' }]
};

const handleCreate = async () => {
    try {
        isCreate.value = true
        formModel.value = reactive({
            activity_name: '',
            cost: 0,
            destinations: []
        })
        open.value = true
    } catch (error) {
        console.error('Setup create error:', error)
    }
}

const edit = async (name) => {
    try {
        isCreate.value = false
        activityName.value = name
        activity.name = name
        await activity.reload()
        formModel.value = activity.doc
        formModel.value.destinations = activity.doc.destination_child.map(child => child.destination)
        open.value = true
    } catch (error) {
        message.error({ content: error.message, duration: 5 })
    }
}

const handleCancel = () => {
    open.value = false
}

const handleSave = async () => {
    try {
        saving.value = true
        if (isCreate.value) {
            const childTable = formModel.value.destinations.map(dest => ({ destination: dest }))
            await activities.insert.submit({ ...formModel.value, destination_child: childTable })
            message.success('Activity created successfully', 2)
        } else {
            activity.doc.destination_child.splice(0, activity.doc.destination_child.length)
            formModel.value.destinations.forEach(dest => {
                activity.doc.destination_child.push({ destination: dest })
            })
            await activity.save.submit()
            message.success('Activity updated successfully', 2)
        }
        await activities.reload()
        open.value = false
    } catch (error) {
        if (error.errorFields) {
            message.error('Please fix the errors below', 2)
        } else {
            message.error('Failed to save activity', 2)
            console.error('Save error:', error)
        }
    } finally {
        saving.value = false
    }
}

const deleteRecord = async (name) => {
    try {
        await activities.delete.submit(name)
        await activities.reload()
        message.success('Successfully deleted activity', 2)
    } catch (error) {
        message.error(error.message || 'Failed to delete activity', 2)
    }
}

const columns = [
    {
        title: 'Activity name',
        key: 'activity_name',
        dataIndex: 'activity_name'
    },
    {
        title: 'Cost',
        key: 'cost',
        dataIndex: 'cost',
        width: '25%'
    },
    {
        title: 'Description',
        key: 'description',
        dataIndex: 'description',
    },
    {
        title: 'Action',
        key: 'Action',
        width: '15%'
    }
]
</script>