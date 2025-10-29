<template>
    <div class="min-h-screen">
        <a-page-header class="!p-0 mb-3 px-4 py-2 sticky top-0 z-10" :title="'Quotation'" @back="() => $router.go(-1)">
            <template #tags>
                <a-tag v-if="quotation?.isDirty" color="orange">Not saved</a-tag>
            </template>
            <template #extra>
                <a-space>
                    <a-button @click="saveDoc" :loading="!!quotation?.save?.loading" type="primary">Save</a-button>
                </a-space>
            </template>
        </a-page-header>
        <a-spin v-if="quotation.get.loading" tip="Loading..." class="block mt-20" />

        <div v-else class="flex flex-col lg:flex-row h-full bg-white">
            <div class="w-full lg:w-[28%] p-4 flex flex-col gap-2">
                <a-form layout="vertical" class="w-full space-y-1">
                    <a-form-item label="Tour" name="tour">
                        <a-select v-model:value="quotation.doc.tour" placeholder="Select tour" :options="tourOptions" />
                    </a-form-item>
                    <a-form-item label="Duration" name="duration">
                        <a-input-number v-model:value="quotation.doc.duration" :min="1" :max="30" class="!w-full"
                            addon-after="Days" />
                    </a-form-item>
                    <a-form-item label="Group Size" name="group_size">
                        <a-space>
                            <a-input-number v-model:value="quotation.doc.min_people" :min="1" :max="20"
                                placeholder="min" class="!w-full" />
                            <a-input-number v-model:value="quotation.doc.max_people" :min="1" :max="20"
                                placeholder="max" class="!w-full" />
                        </a-space>
                    </a-form-item>
                    <a-form-item label="Total Distance" name="total_distance">
                        <a-input-number v-model:value="quotation.doc.total_distance" addon-after="km" class="!w-full" />
                    </a-form-item>
                </a-form>
            </div>
            <div class="flex-1 p-4 overflow-x-hidden overflow-y-auto">
                <a-tabs v-model:activeKey="current" tab-position="top" type="card">
                    <a-tab-pane v-for="day in quotation.doc.duration" :key="day" :tab="`Day ${day}`">
                        <a-form v-for="(a, idx) in quotation.doc.accomodation.filter(
                            (acc) => acc.day === day,
                        )" :key="`form-${idx}`" layout="vertical"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <a-form-item label="Destination" name="destination">
                                <a-select v-model:value="a.destination" :options="destinationOptions" allow-clear
                                    placeholder="Select destination" />
                            </a-form-item>
                            <a-form-item label="Accomodation" name="accomodation">
                                <a-select v-model:value="a.accomodation" :options="accomodationOptions" allow-clear />
                            </a-form-item>
                            <a-form-item label="Distance" name="distance">
                                <a-input-number v-model:value="a.distance" addon-after="km" class="!w-full" />
                            </a-form-item>
                            <a-form-item label="Meals" name="meals">
                                <a-space direction="vertical">
                                    <a-checkbox :checked="!!a.breakfast"
                                        @update:checked="a.breakfast = !a.breakfast">Breakfast</a-checkbox>
                                    <a-checkbox :checked="!!a.lunch"
                                        @update:checked="a.lunch = !a.lunch">Lunch</a-checkbox>
                                    <a-checkbox :checked="!!a.dinner"
                                        @update:checked="a.dinner = !a.dinner">Dinner</a-checkbox>
                                </a-space>
                            </a-form-item>
                            <a-form-item label="Activities" name="activities">
                                <a-checkbox-group v-model:value="dayActivity"
                                    :options="getActivityOptions(a.destination)" />
                            </a-form-item>
                            <a-form-item label="Attractions" name="attractions">
                                <a-checkbox-group v-model:value="dayAttraction"
                                    :options="getAttractionOptions(a.destination)" />
                            </a-form-item>
                        </a-form>
                        <a-form layout="vertical">
                            <a-form-item label="vehicles" name="Vehicles">
                                <a-table :columns="vehicleColumns" :pagination="false"
                                    :data-source="quotation.doc.vehicle?.filter(v => v.day === day) || []">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'vehicle'">
                                            <a-select v-model:value="record.vehicle" :options="vehicleOptions"
                                                @select="getVehicle(record)" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'seats'">
                                            <a-input-number v-model:value="record.seats" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'count'">
                                            <a-input-number v-model:value="record.count" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'consumption'">
                                            <a-input-number v-model:value="record.consumption" class="!w-full"
                                                addon-after="L" />
                                        </template>
                                        <template v-if="column.dataIndex === 'price'">
                                            <a-input-number v-model:value="record.price" class="!w-full"
                                                addon-after="₮" />
                                        </template>
                                        <template v-if="column.dataIndex === 'distance'">
                                            <a-input-number v-model:value="record.distance" class="!w-full"
                                                :status="record.distance === 0 || record.distance === null || record.distance === undefined ? 'error' : ''"
                                                addon-after="km" />
                                        </template>
                                        <template v-if="column.dataIndex === 'fuel_cost'">
                                            <a-input-number v-model:value="record.fuel_cost" class="!w-full"
                                                addon-after="₮" />
                                        </template>
                                        <template v-if="column.dataIndex === 'Action'">
                                            <a-button danger size="small" @click="deleteVehicle(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addVehicle">Add</a-button>
                            </a-form-item>
                        </a-form>
                        <a-form layout="vertical">
                            <a-form-item label="Staffs" name="Staffs">
                                <a-table :columns="staffColumns" :pagination="false"
                                    :data-source="quotation.doc.staffs?.filter(v => v.day === day) || []">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'staff'">
                                            <a-select v-model:value="record.staff" :options="staffOptions"
                                                @select="getStaff(record)" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'count'">
                                            <a-input-number v-model:value="record.count" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'price'">
                                            <a-input-number v-model:value="record.price" class="!w-full"
                                                addon-after="₮" />
                                        </template>

                                        <template v-if="column.dataIndex === 'Action'">
                                            <a-button danger size="small" @click="deleteVehicle(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addStaff">Add</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import { createDocumentResource } from "frappe-ui";
import { ref, computed, watch, watchEffect } from "vue";
import { DestinationStore } from "@/data/destinations";
import { ActivityStore } from "@/data/Activities";
import { message } from "ant-design-vue";
import { ActivityDesStore } from "@/data/ActivityDestination";
import { AttractionsStore } from "@/data/Attraction";
import { vehicleStore } from "@/data/Vehicle";
import { tourStore } from "@/data/Tour";
import { staffStore } from "@/data/Staff";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
const { destinations } = DestinationStore();
const { activities } = ActivityStore();
const { activitiesDes } = ActivityDesStore();
const { attractions } = AttractionsStore();
const { vehicles } = vehicleStore()
const { tours } = tourStore()
const { staffs } = staffStore()

const staffOptions = computed(() => {
    return staffs?.data.map((item) => ({
        label: `${item.full_name}-${item.type}`,
        value: item.name
    })) || [];
})

const tourOptions = computed(() => {
    return tours?.data.map((item) => ({
        label: item.tour_name,
        value: item.name
    })) || [];
});

const vehicleOptions = computed(() => {
    return (vehicles?.data || []).map(item => ({
        label: item.vehicle_name || item.name,
        value: item.name
    }));
});


const destinationOptions = computed(() => {
    return (
        destinations?.data?.map((d) => ({
            value: d.name,
            label: d.destination_name,
        })) || []
    );
});

const accomodationOptions = [
    { value: "Camping" },
    { value: "Hotel" },
    { value: "Ger Camp" },
    { value: "Not included" },
];

const quotation = createDocumentResource({
    doctype: "Quotation",
    name: props.name,
    auto: true,
    whitelistedMethods: {
        getTour: "get_tour",
    },
});

const getActivityOptions = (destination) => {
    return activitiesDes?.data[destination] || [];
};

const getAttractionOptions = (destination) => {
    return attractions.data
        .filter((item) => item.destination === destination)
        .map((item) => item.name);
};
const dayAttraction = computed({
    get() {
        const dayatt = quotation.doc.attractions?.filter((n) => n.day === current.value) || [];
        return dayatt.map((a) => a.attraction);
    },
    set(newNames) {
        if (!Array.isArray(quotation.doc.attractions)) {
            quotation.doc.attractions = [];
        }

        const currentDay = current.value;
        const existingattractions = quotation.doc.attractions.filter((n) => n.day === currentDay);
        const existingNames = existingattractions.map((a) => a.attraction);

        newNames.forEach((name) => {
            if (!existingNames.includes(name)) {
                quotation.doc.attractions.push({
                    day: currentDay,
                    attraction: name,
                    parent: quotation.doc.name,
                    parenttype: "Quotation",
                    parentfield: "attractions",
                });
            }
        });

        quotation.doc.attractions = quotation.doc.attractions.filter((a) => {
            if (a.day !== currentDay) return true;
            return newNames.includes(a.attraction);
        });
    },
});

const dayActivity = computed({
    get() {
        const dayacts = quotation.doc.activities?.filter((n) => n.day === current.value) || [];
        return dayacts.map((a) => a.activity_name);
    },
    set(newNames) {
        if (!Array.isArray(quotation.doc.activities)) {
            quotation.doc.activities = [];
        }

        const currentDay = current.value;
        const existingActivities = quotation.doc.activities.filter((n) => n.day === currentDay);
        const existingNames = existingActivities.map((a) => a.activity_name);


        newNames.forEach((name) => {
            if (!existingNames.includes(name)) {
                quotation.doc.activities.push({
                    day: currentDay,
                    activity_name: name,
                    parent: quotation.doc.name,
                    parenttype: "Tour",
                    parentfield: "activities",
                });
            }
        });


        quotation.doc.activities = quotation.doc.activities.filter((a) => {
            if (a.day !== currentDay) return true;
            return newNames.includes(a.activity_name);
        });
    },
});

const current = ref(1);
watch(
    () => quotation?.doc?.duration,
    (duration) => {
        for (let i = 1; i <= duration; i++) {
            const exists = quotation.doc.accomodation.some((a) => a.day === i);
            if (!exists) {
                quotation.doc.accomodation.push({
                    day: i,
                    title: "",
                    destination: null,
                    difficulty: null,
                    accomodation: null,
                    distance: null,
                    drive_time: null,
                    terrain: null,
                    altitude: null,
                    parent: quotation.doc.name,
                    parenttype: "Quotation",
                    parentfield: "accomodation",
                    doctype: "Tour Accomodation",
                });
            }
        }
    },
    { immediate: true },
);


const saveDoc = async () => {
    try {
        quotation.save.submit();
        message.success("Successflly saved", 2);
    } catch (error) {
        message.error(error.message, 2);
    }
};

const addVehicle = () => {
    quotation.doc.vehicle.push({
        day: current.value,
        vehicle: "",
        seats: 0,
        count: 1,
        consumption: 0,
        price: 0,
    });
}
const addStaff = () => {
    quotation.doc.staffs.push({
        day: current.value,
        staff: "",
        price: 0,
        count: 1,
        stuff_cost: 0,
    });
}
const deleteVehicle = (record) => {
    if (!quotation.doc.vehicle || !Array.isArray(quotation.doc.vehicle)) return;
    if (record.name) {
        quotation.doc.vehicle = quotation.doc.vehicle.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.vehicle = tour.doc.vehicle.filter((n) => n !== record);
    }
    message.success("Vehicle deleted");
};

const getVehicle = (record) => {
    if (!record.vehicle) return;

    const vec = vehicles.data.find(item => item.name === record.vehicle);
    record.seats = vec.seats
    record.consumption = vec.consumption
    record.price = vec.price
    record.fuel_cost = vec.fuel_cost

};
const getStaff = (record)=>{
    if (!record.staff) return;
    const st = staffs.data.find(item => item.name === record.staff);
    record.price = st.price

}

watchEffect(() => {
    if (!quotation.doc?.vehicle) return;
    quotation.doc.vehicle.forEach((v) => {
        v.vehicle_cost = ((v.price || 0) * (v.count || 0)) + ((v.fuel_cost || 0) * (v.distance || 0));
    });
});
watchEffect(() => {
    if (!quotation.doc?.staffs) return;
    quotation.doc.staffs.forEach((v) => {
        v.staff_cost = ((v.price || 0) * (v.count || 0));
    });
});

const vehicleColumns = [
    {
        title: 'Vehicle',
        key: 'vehicle',
        dataIndex: 'vehicle',
        width: '15%'
    },
    {
        title: 'Seats',
        key: 'seats',
        dataIndex: 'seats',
    },
    {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
    },
    {
        title: 'Count',
        key: 'count',
        dataIndex: 'count',
    },
    {
        title: 'Distance',
        key: 'distance',
        dataIndex: 'distance',
    },
    {
        title: 'Fuel cost per km ',
        key: 'fuel_cost',
        dataIndex: 'fuel_cost',
    },
    {
        title: 'Vehicle cost',
        key: 'vehicle_cost',
        dataIndex: 'vehicle_cost',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    },
]
const staffColumns = [
    {
        title: 'Staff',
        key: 'staff',
        dataIndex: 'staff',
        width: '30%'
    },
    {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
    },
    {
        title: 'Count',
        key: 'count',
        dataIndex: 'count',
    },
    {
        title: 'Staff cost',
        key: 'staff_cost',
        dataIndex: 'staff_cost',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    },
]



</script>