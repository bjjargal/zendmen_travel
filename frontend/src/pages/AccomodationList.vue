<template>
    <a-page-header class="!p-0 !mb-2" title="Accomodation">
    </a-page-header>
    <a-table :columns="columns" :data-source="accomodations.data" size="small" :loading="accomodations.list.loading"
        class=" min-w-screen  overflow-x-auto" bordered :pagination="false" row-key="name"
        :scroll="{ x: 800, y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Action'">
                <span class="editable-row-operations">
                    <div class="flex gap-2">
                        <template v-if="editingKeys.has(record.name)">
                            <a-button type="primary" size="small" @click="save(record.name)">Save</a-button>
                            <a-button @click="cancel(record.name)" size="small">Cancel</a-button>
                        </template>
                        <template v-else>
                            <a-button @click="edit(record.name)" type="primary" size="small"
                                class="!flex justify-center items-center">
                                <template #icon>
                                    <FeatherIcon name="edit" class="size-4" />
                                </template>
                            </a-button>
                        </template>
                    </div>
                </span>
            </template>
            <template v-else>
                <div v-if="editingKeys.has(record.name)" class="editable-cell-edit">
                    <template v-if="column.dataIndex === 'destination'">
                        <a-select v-model:value="record[column.dataIndex]" :options="destinationOptions" allow-clear
                            @change="(value) => value === undefined ? record[column.dataIndex] = '' : record[column.dataIndex] = value"
                            style="width: 100%" />
                    </template>
                    <template v-else-if="column.dataIndex === 'type'">
                        <a-select v-model:value="record[column.dataIndex]" :options="typeOptions" style="width: 100%" />
                    </template>
                    <template v-else-if="isPriceColumn(column.dataIndex)">
                        <a-input-number v-model:value="record[column.dataIndex]" style="width: 100%" :min="0"
                            :formatter="numberFormatter" :parser="numberParser" />
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
    <a-button class="mt-3" @click="addNewRow">Add Accomodation</a-button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { DestinationStore } from '@/data/destinations';
import { AccommodationsStore } from '@/data/Accomodations';


const { accomodations } = AccommodationsStore()
const { destinations } = DestinationStore()

const editingKeys = ref(new Set())

const destinationOptions = computed(() => {
    return destinations?.data?.map(d => ({
        value: d.name,
        label: d.destination_name
    })) || []
})

const typeOptions = [
    { value: 'Hotel' },
    { value: 'Ger Camp' },
    { value: 'Camping' },
    { value: 'Not included' }
]

const priceColumns = ['lux_price', 'standard_price', 'single_supplement', 'staff_price', 'tourist_b', 'tourist_l', 'tourist_d', 'staff_b', 'staff_l', 'staff_d']

const isPriceColumn = (dataIndex) => priceColumns.includes(dataIndex)

const numberFormatter = (value) => {
    return value ? value.toLocaleString() : ''
}

const numberParser = (value) => {
    return value ? value.replace(/,/g, '') : ''
}

const getCellValue = (record, dataIndex) => {
    let val = record[dataIndex]
    if (isPriceColumn(dataIndex)) {
        return val ? `${val.toLocaleString()} ₮` : '-'
    }
    return val || '-'
}

const edit = (key) => {
    editingKeys.value.add(key)
}

const cancel = (key) => {
    editingKeys.value.delete(key)
    const row = accomodations.data.find(item => item.name === key)
    if (key.startsWith('temp-') && row) {
        const index = accomodations.data.findIndex(item => item.name === key)
        if (index > -1) {
            accomodations.data.splice(index, 1)
        }
    }
}

const addNewRow = () => {
    const tempName = `temp-${Date.now()}`
    const newRow = {
        name: tempName,
        accomodation_name: '',
        destination: '',
        type: '',
        lux_price: 0,
        single_supplement: 0,
        standard_price: 0,
        staff_price: 0,
        tourist_b: 0,
        tourist_l: 0,
        tourist_d: 0,
        staff_b: 0,
        staff_l: 0,
        staff_d: 0,
    }
    accomodations.data.push(newRow)
    editingKeys.value.add(tempName)
}

const save = async (key) => {
    try {
        const row = accomodations.data.find(item => item.name === key)
        const isNew = key.startsWith('temp-')
        if (isNew) {
            const createData = { ...row }
            delete createData.name
            await accomodations.insert.submit(createData)
            const index = accomodations.data.findIndex(item => item.name === key)
            if (index > -1) {
                accomodations.data.splice(index, 1)
            }
            message.success('Accommodation added successfully')
        } else {
            await accomodations.setValue.submit({ ...row })
            message.success('Accommodation updated successfully')
        }
        editingKeys.value.delete(key)
    } catch (error) {
        message.error('Failed to save accommodation')
    }
}

const columns = [
    {
        title: 'Accomodation Name',
        key: 'accomodation_name',
        dataIndex: 'accomodation_name',
        width: '180px',
        fixed: 'left'
    },
    {
        title: 'Destination',
        key: 'destination',
        dataIndex: 'destination',
        width: '180px'
    },
    {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
        width: 150
    },
    {
        title: 'Single supplement',
        key: 'single_supplement',
        dataIndex: 'single_supplement',
        width: 150
    },
    {
        title: 'Lux price',
        key: 'lux_price',
        dataIndex: 'lux_price',
        width: 100
    },
    {
        title: 'Standard price',
        key: 'standard_price',
        dataIndex: 'standard_price',
        width: 100
    },
    {
        title: 'Staff price',
        key: 'staff_price',
        dataIndex: 'staff_price',
        width: 100
    },
    {
        title: 'Tourist Meal',
        children: [
            {
                title: 'Breakfast',
                dataIndex: 'tourist_b',
                key: 'tourist_b',
                width: 100
            },
            {
                title: 'Lunch',
                dataIndex: 'tourist_l',
                key: 'tourist_l',
                width: 100
            },
            {
                title: 'Dinner',
                dataIndex: 'tourist_d',
                key: 'tourist_d',
                width: 100
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
                width: 100
            },
            {
                title: 'Lunch',
                dataIndex: 'staff_l',
                key: 'staff_l',
                width: 100
            },
            {
                title: 'Dinner',
                dataIndex: 'staff_d',
                key: 'staff_d',
                width: 100
            }
        ],
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 200
    },
    {
        title: 'Action',
        key: 'Action',
        fixed: 'right',
        width: 100

    }
]
</script>