<template>
    <a-page-header class="!p-0 !mb-2" title="Accomodation">
    </a-page-header>
    <a-table :columns="columns" :data-source="accomodations.data" size="small" :loading="accomodations.list.loading"
        bordered="" :pagination="false" row-key="name" :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Action'">
                <span class="editable-row-operations">
                    <div class="flex gap-2">
                        <template v-if="editingKey === record.name">
                            <a-popconfirm title="Are you sure to save this row?" @confirm="save(record.name)">
                                <a-button type="primary" size="small">Save</a-button>
                            </a-popconfirm>
                            <a-button @click="cancel" size="small">Cancel</a-button>
                        </template>
                        <template v-else>
                            <a-button @click="edit(record.name)" type="primary" size="small" class="!flex justify-center items-center">
                                <template #icon>
                                    <FeatherIcon name="edit" class="size-4" />
                                </template>
                            </a-button>
                        </template>
                    </div>
                </span>
            </template>
            <template v-else>
                <div v-if="editingKey === record.name" class="editable-cell-edit">
                    <template v-if="column.dataIndex === 'destination'">
                        <a-select v-model:value="record[column.dataIndex]" :options="destinationOptions" style="width: 100%" />
                    </template>
                    <template v-else-if="isPriceColumn(column.dataIndex)">
                        <a-input-number v-model:value="record[column.dataIndex]" style="width: 100%" :min="0" />
                    </template>
                    <template v-else>
                        <a-input v-model:value="record[column.dataIndex]" style="width: 100%" />
                    </template>
                </div>
                <div v-else class="editable-cell" @click="edit(record.name)" style="cursor: pointer; padding: 4px 8px;">
                    {{ getCellValue(record, column.dataIndex) }}
                </div>
            </template>
        </template>
    </a-table>
    <a-button class="mt-3" @click="visible = true">Add Accomodation</a-button>

    <a-modal v-model:visible="visible" title="Add Accommodation" @ok="handleAdd" :confirm-loading="confirmLoading" width="600px">
        <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
            <a-form-item label="Accomodation Name" name="accomodation_name">
                <a-input v-model:value="formState.accomodation_name" />
            </a-form-item>
            <a-form-item label="Destination" name="destination">
                <a-select v-model:value="formState.destination" :options="destinationOptions" />
            </a-form-item>
            <a-form-item label="Type" name="type">
                <a-input v-model:value="formState.type" />
            </a-form-item>
            <a-form-item label="Lux Price" name="lux_price">
                <a-input-number v-model:value="formState.lux_price" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Standard Price" name="standard_price">
                <a-input-number v-model:value="formState.standard_price" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Staff Price" name="staff_price">
                <a-input-number v-model:value="formState.staff_price" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Tourist Breakfast Price" name="tourist_b">
                <a-input-number v-model:value="formState.tourist_b" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Tourist Lunch Price" name="tourist_l">
                <a-input-number v-model:value="formState.tourist_l" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Tourist Dinner Price" name="tourist_d">
                <a-input-number v-model:value="formState.tourist_d" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Staff Breakfast Price" name="staff_b">
                <a-input-number v-model:value="formState.staff_b" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Staff Lunch Price" name="staff_l">
                <a-input-number v-model:value="formState.staff_l" style="width: 100%" :min="0" />
            </a-form-item>
            <a-form-item label="Staff Dinner Price" name="staff_d">
                <a-input-number v-model:value="formState.staff_d" style="width: 100%" :min="0" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { ActivityStore } from '@/data/Activities';
import { DestinationStore } from '@/data/destinations';
import { AccommodationsStore } from '@/data/Accomodations';
import { Form, Input, Select, InputNumber, Modal, Popconfirm } from 'ant-design-vue';

const { accomodations } = AccommodationsStore()
const { destinations } = DestinationStore()

const editingKey = ref('')
const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref()

const formState = reactive({
    accomodation_name: '',
    destination: '',
    type: '',
    lux_price: null,
    standard_price: null,
    staff_price: null,
    tourist_b: null,
    tourist_l: null,
    tourist_d: null,
    staff_b: null,
    staff_l: null,
    staff_d: null,
})

const rules = {
    accomodation_name: [{ required: true, message: 'Please input accomodation name' }],
    destination: [{ required: true, message: 'Please select destination' }],
    type: [{ required: true, message: 'Please input type' }],
    lux_price: [{ required: true, message: 'Please input lux price' }],
    standard_price: [{ required: true, message: 'Please input standard price' }],
    staff_price: [{ required: true, message: 'Please input staff price' }],
    // Optional for meals, or add required if needed
}

const destinationOptions = computed(() => {
    return destinations?.data?.map(d => ({
        value: d.name,
        label: d.destination_name
    })) || []
})

const priceColumns = ['lux_price', 'standard_price', 'staff_price', 'tourist_b', 'tourist_l', 'tourist_d', 'staff_b', 'staff_l', 'staff_d']

const isPriceColumn = (dataIndex) => priceColumns.includes(dataIndex)

const getCellValue = (record, dataIndex) => {
    let val = record[dataIndex]
    if (isPriceColumn(dataIndex)) {
        return val ? `$${val}` : '-'
    }
    return val || '-'
}

const edit = (key) => {
    editingKey.value = key
}

const cancel = () => {
    editingKey.value = ''
}

const save = async (key) => {
    try {
        const row = accomodations.data.find(item => item.name === key)
        // Assume AccommodationsStore has an update method that persists changes
        await accomodations.setValue.submit({
            ...row
        })
        editingKey.value = ''
        message.success('Accommodation updated successfully')
    } catch (error) {
        message.error('Failed to update accommodation')
    }
}

const resetForm = () => {
    formState.accomodation_name = ''
    formState.destination = ''
    formState.type = ''
    formState.lux_price = null
    formState.standard_price = null
    formState.staff_price = null
    formState.tourist_b = null
    formState.tourist_l = null
    formState.tourist_d = null
    formState.staff_b = null
    formState.staff_l = null
    formState.staff_d = null
}

const handleAdd = async () => {
    try {
        await formRef.value.validateFields()
        confirmLoading.value = true
        // Assume AccommodationsStore has a create method that persists and updates the list
        await AccommodationsStore().create({ ...formState })
        visible.value = false
        resetForm()
        message.success('Accommodation added successfully')
    } catch (error) {
        message.error('Failed to add accommodation')
    } finally {
        confirmLoading.value = false
    }
}

const columns = [
    {
        title: 'Accomodation Name',
        key: 'accomodation_name',
        dataIndex: 'accomodation_name'
    },
    {
        title: 'Destination',
        key: 'destination',
        dataIndex: 'destination'
    },
    {
        title: 'Type',
        key: 'type',
        dataIndex: 'type'
    },
    {
        title: 'Lux price',
        key: 'lux_price',
        dataIndex: 'lux_price',
    },
    {
        title: 'Standard price',
        key: 'standard_price',
        dataIndex: 'standard_price',
    },
    {
        title: 'Staff price',
        key: 'staff_price',
        dataIndex: 'staff_price',
    },
    {
        title: 'Tourist Meal',
        children: [
            {
                title: 'Breakfast',
                dataIndex: 'tourist_b',
                key: 'tourist_b',
            },
            {
                title: 'Lunch',
                dataIndex: 'tourist_l',
                key: 'tourist_l',
            },
            {
                title: 'Dinner',
                dataIndex: 'tourist_d',
                key: 'tourist_d',
            }
        ],
    },
    {
        title: 'Staff Meal',
        children: [
            {
                title: 'Breakfast',
                dataIndex: 'staff_b',
                key: 'staff_b',
            },
            {
                title: 'Lunch',
                dataIndex: 'staff_l',
                key: 'staff_l',
            },
            {
                title: 'Dinner',
                dataIndex: 'staff_d',
                key: 'staff_d',
            }
        ],
    },
    {
        title: 'Action',
        key: 'Action',

    }
]
</script>