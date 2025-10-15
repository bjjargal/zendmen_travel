<template>
    <a-page-header class="!p-0 !mb-2" title="Activity">
        <template #extra>
            <a-button type="primary" @click="open = true">Create activity</a-button>
        </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="activities.data" size="small" :loading="activities.list.loading"
        :pagination="false" row-key="name" :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="['activity_name', 'cost'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.name] && column.type === 'data'"
                        v-model:value="editableData[record.name][column.dataIndex]" style="margin: -5px 0" />
                    <a-input-number v-else-if="editableData[record.name] && column.type === 'number'"
                        v-model:value="editableData[record.name][column.dataIndex]" style="margin: -5px 0" />
                    <template v-else>
                        {{ column.dataIndex === 'cost' ? `$${record[column.dataIndex]}` : record[column.dataIndex] }}
                    </template>
                </div>
            </template>
            <template v-if="column.key === 'Action'">
                <div class="editable-row-operations">
                    <span v-if="editableData[record.name]">
                        <a-typography-link @click="save(record.name)" style="margin-right: 8px">
                            Save
                        </a-typography-link>
                        <a-typography-link @click="cancel(record.name)">
                            Cancel
                        </a-typography-link>
                    </span>
                    <div v-else class="flex gap-2">
                        <a-button x @click="edit(record.name)" type="primary" class="!flex justify-center items-center">
                            <template #icon>
                                <FeatherIcon name="edit" class="size-4" />
                            </template>
                        </a-button>
                        <a-button x @click="deleteRecord(record.name)" type="primary"
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
    <a-modal v-model:open="open" title="Create Activity" @ok="handleCreate" @cancel="open = false">
        <a-form ref="createFormRef" :model="newActivity" :rules="formRules" layout="vertical">
            <a-form-item label="Activity Name" name="activity_name">
                <a-input v-model:value="newActivity.activity_name" placeholder="Enter activity name" />
            </a-form-item>
            <a-form-item label="Cost" name="cost">
                <a-input-number v-model:value="newActivity.cost" :min="0" :precision="2" placeholder="Enter cost" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ActivityStore } from '@/data/Activities';
import { ref, reactive, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue';

const { activities } = ActivityStore()
const open = ref(false)
const createFormRef = ref()

const editableData = reactive({});

const newActivity = reactive({ activity_name: '', cost: 0 });

const formRules = {
    activity_name: [{ required: true, message: 'Please enter activity name' }],
    cost: [{ required: true, message: 'Please enter cost' }, { type: 'number', min: 0, message: 'Cost must be at least 0' }]
};

const edit = (name) => {
    const item = activities.data.find(item => item.name === name);
    if (item) {
        editableData[name] = cloneDeep(item);
    }
};

const save = async (name) => {
    try {
        await activities.setValue.submit(editableData[name]);
        message.success('Activity updated successfully', 2);
        // await activities.reload();
        delete editableData[name];
    } catch (error) {
        message.error('Failed to update activity', 2);

    }
};

const cancel = (name) => {
    delete editableData[name];
};

const deleteRecord = (name) => {
    activities.delete.submit(name)
    message.success('Succesfully deleted activity', 2)
}

const handleCreate = async () => {
    try {
        await createFormRef.value.validate();
        await activities.insert.submit({ ...newActivity });
        message.success('Activity created successfully', 2);
        // await activities.reload();
        Object.assign(newActivity, { activity_name: '', cost: 0 });
        open.value = false;
        await nextTick(() => createFormRef.value.resetFields());
    } catch (error) {
        if (error.errorFields) {
            message.error('Please fix the errors below', 2);
        } else {
            message.error('Failed to create activity', 2);
            console.error('Create error:', error);
        }
    }
};

const columns = [
    {
        title: 'Activity name',
        key: 'activity_name',
        type: 'data',
        dataIndex: 'activity_name'
    },
    {
        title: 'Cost',
        key: 'cost',
        type: 'number',
        dataIndex: 'cost',
        width: '25%'
    },
    {
        title: 'Action',
        key: 'Action',
        width: '15%'
    }
]
</script>