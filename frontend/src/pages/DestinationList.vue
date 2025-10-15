<template>
    <a-page-header class="!p-0 !mb-2" title="Activity">
        <template #extra>
            <a-button type="primary" @click="open = true">Create activity</a-button>
        </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="destinations.data" size="small" :loading="destinations.list.loading"
        :pagination="false" row-key="name" :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="['destination_name'].includes(column.dataIndex)">
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
        <a-form ref="createFormRef" :model="newDestination" :rules="formRules" layout="vertical">
            <a-form-item label="Destination Name" name="destination_name">
                <a-input v-model:value="newDestination.destination_name" placeholder="Enter destination name" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue';
import { DestinationStore } from '@/data/destinations';
const { destinations } = DestinationStore()
const open = ref(false)
const createFormRef = ref()

const editableData = reactive({});

const newDestination = reactive({ destination_name: '' });

const formRules = {
    destination_name: [{ required: true, message: 'Please enter destination name' }],
};

const edit = (name) => {
    const item = destinations.data.find(item => item.name === name);
    if (item) {
        editableData[name] = cloneDeep(item);
    }
};

const save = async (name) => {
    try {
        await destinations.setValue.submit(editableData[name]);
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

const deleteRecord = async (name) => {
    try {
        await destinations.delete.submit(name)
        message.success('Succesfully deleted activity', 2)
    }
    catch (error) {
        message.error(error.message, 2);
    }

}

const handleCreate = async () => {
    try {
        await createFormRef.value.validate();
        await destinations.insert.submit({ ...newDestination });
        message.success('Activity created successfully', 2);
        // await activities.reload();
        Object.assign(newDestination, { destination_name: '', });
        open.value = false;
        await nextTick(() => createFormRef.value.resetFields());
    } catch (error) {
        if (error.errorFields) {
            message.error('Please fix the errors below', 2);
        } else {
            message.error('Failed to create activity', 2);
        }
    }
};

const columns = [
    {
        title: 'Destination Name',
        key: 'destination_name',
        type: 'data',
        dataIndex: 'destination_name'
    },
    {
        title: 'Action',
        key: 'Action',
        width: '15%'
    }
]
</script>