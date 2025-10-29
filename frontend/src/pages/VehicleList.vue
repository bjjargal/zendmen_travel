<template>
    <a-page-header class="!p-0 !mb-2" title="Vehicles">
        <template #extra>
            <a-button type="primary" @click="newOpen = true">Create Vehicle</a-button>
        </template>
    </a-page-header>
    <div class="overflow-x-auto">
        <a-table :columns="columns" :data-source="vehicles.data" size="small" :loading="vehicles.list.loading"
            :pagination="false" row-key="name" :scroll="{ x: 800, y: 'calc(100vh - 280px)' }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'Action'">
                    <div class="flex gap-2 justify-center">
                        <a-button @click="edit(record.name)" type="ghost" class="!flex justify-center items-center">
                            <template #icon>
                                <FeatherIcon name="edit" class="size-4" />
                            </template>
                        </a-button>
                        <!-- <a-button @click="deleteRecord(record.name)" type="ghost" danger
                            class="!flex justify-center items-center !text-red-500">
                            <template #icon>
                                <FeatherIcon name="trash-2" class="size-4" />
                            </template>
                        </a-button> -->
                    </div>
                </template>
            </template>
        </a-table>
    </div>
    <a-modal v-model:open="open" title="Vehicle" okText='save' @ok="handleSave">
        <a-form :model="Vehicle.doc" layout="vertical">
            <a-form-item label="Vehicle name" name="vehicle_name">
                <a-input v-model:value="Vehicle.doc.vehicle_name"></a-input>
            </a-form-item>
            <a-form-item label="Seats" name="seats">
                <a-input-number v-model:value="Vehicle.doc.seats" class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Consumption" name="consumption">
                <a-input-number v-model:value="Vehicle.doc.consumption" addon-after="L"
                    class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="price" name="price">
                <a-input-number v-model:value="Vehicle.doc.price" addon-after="₮" class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Fuel cost per km" name="fuel_cost">
                <a-input-number v-model:value="Vehicle.doc.fuel_cost" addon-after="₮" class="!w-full"></a-input-number>
            </a-form-item>

        </a-form>
    </a-modal>
    <a-modal v-model:open="newOpen" title="New vehicle" okText='Create' @ok="handleCreate">
        <a-form :model="newVehicle" layout="vertical">
            <a-form-item label="Vehicle name" name="vehicle_name">
                <a-input v-model:value="newVehicle.vehicle_name"></a-input>
            </a-form-item>
            <a-form-item label="Seats" name="seats">
                <a-input-number v-model:value="newVehicle.seats" class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Consumption" name="consumption">
                <a-input-number v-model:value="newVehicle.consumption" addon-after="L" class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="price" name="price">
                <a-input-number v-model:value="newVehicle.price" addon-after="₮" class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Fuel cost per km" name="fuel_cost">
                <a-input-number v-model:value="newVehicle.fuel_cost" addon-after="₮" class="!w-full"></a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>

</template>


<script setup>
import { createDocumentResource } from 'frappe-ui';
import { message } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { vehicleStore } from '@/data/Vehicle';





const { vehicles } = vehicleStore()

const open = ref(false)
const newOpen = ref(false)
const vehicleName = ref('')


const newVehicle = reactive({
    vehicle_name: '',
    seats: 1,
    consumption: 0,
    price: 0,
    fuel_cost:0

})


const Vehicle = createDocumentResource({
    doctype: 'Vehicle',
    name: newVehicle,
    auto: false
})


const deleteRecord = async (name) => {
    try {
        await vehicles.delete.submit(name)
        await vehicles.reload()
        message.success('Successfully deleted activity', 2)
    } catch (error) {
        message.error(error.message || 'Failed to delete activity', 2)
    }
}

const edit = async (name) => {
    try {
        vehicleName.value = name
        Vehicle.name = name
        await Vehicle.reload()
        open.value = true
    } catch (error) {
        message.error({ content: error.message, duration: 2 })
    }
}

const handleSave = async () => {
    try {

        await Vehicle.save.submit();
        message.success("Vehicle updated successfully");
        open.value = false;
    } catch (error) {
        message.error(error.message || "Failed to save");
    }
};

const handleCreate = async () => {
    try {
        await vehicles.insert.submit({ ...newVehicle })
        message.success('Successfully created new vehicle')
        newOpen.value = false
    } catch (error) {
        message.error(error.message, 2)
        newOpen.value = false
    }
}

const columns = [
    {
        title: 'Vehicle name',
        key: 'vehicle_name',
        dataIndex: 'vehicle_name',
    },
    {
        title: 'Seats',
        key: 'seats',
        dataIndex: 'seats',
    },
    {
        title: 'Consumption',
        key: 'consumption',
        dataIndex: 'consumption',
    },
    {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    }
]
</script>