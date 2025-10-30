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
                    <a-form-item label="Categoty" name="category">
                        <a-select v-model:value="quotation.doc.category" placeholder="Select category"
                            :options="categotyOptions" />
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
                            <a-form-item label="Min price" name="min_price">
                                <a-input :disabled="true" v-model:value="a.min_price"></a-input>
                            </a-form-item>
                            <a-form-item label="Max price" name="max_price">
                                <a-input :disabled="true" v-model:value="a.max_price"></a-input>
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
                                            <a-button danger size="small" @click="deleteStaff(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addStaff">Add</a-button>
                            </a-form-item>
                        </a-form>
                        <a-form v-for="(a, idx) in quotation.doc.accomodation.filter(
                            (acc) => acc.day === day,
                        )" :key="`form-${idx}`" layout="vertical">
                            <a-form-item label="Tourist accomodation" name="tourist_accomodation">
                                <a-table :columns="AccommodationColumns" :pagination="false"
                                    :data-source="quotation.doc.tourist_accomodation?.filter(v => v.day === day) || []">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'accomodation'">
                                            <a-select v-model:value="record.accomodation"
                                                :options="getAccommodationOptions({ destination: a.destination, type: a.accomodation })"
                                                @select="getAccomodation(record, a)" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'meal'">
                                            <a-input-number v-model:value="record.meal" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'hotel'">
                                            <a-input-number v-model:value="record.hotel" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'vehicle'">
                                            <a-input-number v-model:value="record.vehicle" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'staff'">
                                            <a-input-number v-model:value="record.staff" class="!w-full" />
                                        </template>
                                        <template v-if="column.dataIndex === 'staff_accomodation'">
                                            <a-input-number v-model:value="record.staff_accomodation" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'Action'">
                                            <a-button danger size="small" @click="deleteAccomodation(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addAccomodation">Add</a-button>
                            </a-form-item>
                        </a-form>
                        <a-form layout="vertical">
                            <a-form-item label="Activity Price" name="activities">
                                <a-table :columns="ActivityColumns" :pagination="false"
                                    :data-source="quotation.doc.activities?.filter(v => v.day === day) || []">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'activity_name'">
                                            <a-select v-model:value="record.activity_name" :options="[]"
                                                @select="getActivity(record)" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'cost'">
                                            <a-input-number v-model:value="record.cost" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'Action'">
                                            <a-button danger size="small" @click="deleteActivity(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addActivity">Add</a-button>
                            </a-form-item>
                        </a-form>
                        <a-form layout="vertical">
                            <a-form-item label="Attraction Price" name="attractions">
                                <a-table :columns="AttractionColumns" :pagination="false"
                                    :data-source="quotation.doc.attractions?.filter(v => v.day === day) || []">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'attraction'">
                                            <a-select v-model:value="record.attraction" :options="[]"
                                                @select="getAttraction(record)" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'cost'">
                                            <a-input-number v-model:value="record.cost" class="!w-full" />
                                        </template>

                                        <template v-if="column.dataIndex === 'Action'">
                                            <a-button danger size="small" @click="deleteAttraction(record)">
                                                <FeatherIcon name="trash" class="size-4" />
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="!mt-3" @click="addAttraction">Add</a-button>
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
import { AccommodationsStore } from "@/data/Accomodations";

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
const { accomodations } = AccommodationsStore()

const getAccommodationOptions = (filters = {}) => {
    if (!accomodations?.data) return [];

    return accomodations.data
        .filter((item) =>
            Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // ignore empty filters
                return item[key] === value;
            })
        )
        .map((item) => ({
            label: item.accomodation_name,
            value: item.name,
        }));
};

console.log(accomodations?.data)

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
const categotyOptions = [{ value: 'Luxury' }, { value: 'Budget' }, { value: 'Standard' },]

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
const addAccomodation = () => {
    quotation.doc.tourist_accomodation.push({
        day: current.value,
        accomodation: "",
        meal: 0,
        hotel: 0,
        vehicle: 0,
        staff: 0,
        count: 0,
    });
}
const addActivity = () => {
    quotation.doc.activities.push({
        day: current.value,
        activity_name: "",
        cost: 0,
    });
}
const addAttraction = () => {
    quotation.doc.attractions.push({
        day: current.value,
        attraction: "",
        cost: 0,
    });
}

const deleteVehicle = (record) => {
    if (!quotation.doc.vehicle || !Array.isArray(quotation.doc.vehicle)) return;
    if (record.name) {
        quotation.doc.vehicle = quotation.doc.vehicle.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.vehicle = quotation.doc.vehicle.filter((n) => n !== record);
    }
    message.success("Vehicle deleted");
};

const deleteStaff = (record) => {
    if (!quotation.doc.staffs || !Array.isArray(quotation.doc.staffs)) return;
    if (record.name) {
        quotation.doc.staffs = quotation.doc.staffs.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.staffs = quotation.doc.staffs.filter((n) => n !== record);
    }
    message.success("Staff deleted");
};

const deleteAccomodation = (record) => {
    if (!quotation.doc.tourist_accomodation || !Array.isArray(quotation.doc.tourist_accomodation)) return;
    if (record.name) {
        quotation.doc.tourist_accomodation = quotation.doc.tourist_accomodation.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.tourist_accomodation = quotation.doc.tourist_accomodation.filter((n) => n !== record);
    }
    message.success("Accommodation deleted");
};

const deleteActivity = (record) => {
    if (!quotation.doc.activities || !Array.isArray(quotation.doc.activities)) return;
    if (record.name) {
        quotation.doc.activities = quotation.doc.activities.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.activities = quotation.doc.activities.filter((n) => n !== record);
    }
    message.success("Activity deleted");
};

const deleteAttraction = (record) => {
    if (!quotation.doc.attractions || !Array.isArray(quotation.doc.attractions)) return;
    if (record.name) {
        quotation.doc.attractions = quotation.doc.attractions.filter((n) => n.name !== record.name);
    } else {
        quotation.doc.attractions = quotation.doc.attractions.filter((n) => n !== record);
    }
    message.success("Attraction deleted");
};

const getVehicle = (record) => {
    if (!record.vehicle) return;

    const vec = vehicles.data.find(item => item.name === record.vehicle);
    record.seats = vec.seats
    record.consumption = vec.consumption
    record.price = vec.price
    record.fuel_cost = vec.fuel_cost

};
const getStaff = (record) => {
    if (!record.staff) return;
    const st = staffs.data.find(item => item.name === record.staff);
    record.price = st.price

}
const getAccomodation = (record, dayAcc) => {
    const acco = accomodations.data.find(item => item.name === record.accomodation);
    record.meal = (dayAcc.breakfast ? acco.tourist_b : 0) + (dayAcc.lunch ? acco.tourist_l : 0) + (dayAcc.dinner ? acco.tourist_d : 0)
    record.hotel = quotation.doc.category === 'Luxury' ? acco.lux_price : acco.standard_price
    // record.vehicle = (quotation.doc.vehicle
    //     ?.filter(v => v.day === current.value)
    //     .reduce((sum, v) => sum + (Number(v.vehicle_cost) || 0), 0) || 0) / quotation.doc.min_people;
    // record.staff = (quotation.doc.staffs
    //     ?.filter(v => v.day === current.value)
    //     .reduce((sum, v) => sum + (Number(v.staff_cost) || 0), 0) || 0) / quotation.doc.min_people;
    const staff_count = record.staffs = (quotation.doc.staffs
        ?.filter(v => v.day === current.value)
        .reduce((sum, v) => sum + (Number(v.count) || 0), 0) || 0);
    record.staff_accomodation = (staff_count * ((dayAcc.breakfast ? acco.staff_b : 0) + (dayAcc.lunch ? acco.staff_l : 0) + (dayAcc.dinner ? acco.staff_d : 0)
        + acco.staff_price)) / quotation.doc.min_people
    record.total = record.meal + record.hotel + record.staff_accomodation
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

// New watchEffect for calculating min_price and max_price per accommodation (per day)
watchEffect(() => {
    if (!quotation?.isDirty) return;

    const min_people = quotation.doc.min_people || 1;
    const max_people = quotation.doc.max_people || 1;

    quotation.doc.accomodation.forEach((a) => {
        const day = a.day;

        // Sum vehicle costs for the day
        const sum_vehicle = (quotation.doc.vehicle || []).filter((v) => v.day === day).reduce((sum, v) => sum + (v.vehicle_cost || 0), 0);
        const vehicle_per_min = sum_vehicle / max_people; // Lower per person when group is larger
        const vehicle_per_max = sum_vehicle / min_people; // Higher per person when group is smaller

        // Sum staff costs for the day
        const sum_staff = (quotation.doc.staffs || []).filter((s) => s.day === day).reduce((sum, s) => sum + (s.staff_cost || 0), 0);
        const staff_per_min = sum_staff / max_people;
        const staff_per_max = sum_staff / min_people;

        // Sum tourist accommodation totals for the day (assumed already per person)
        const sum_tourist = (quotation.doc.tourist_accomodation || []).filter((t) => t.day === day).reduce((sum, t) => sum + (t.total || 0), 0);

        // Sum activity costs for the day (assumed per person)
        const sum_activities = (quotation.doc.activities || []).filter((act) => act.day === day).reduce((sum, act) => sum + (act.cost || 0), 0);

        // Sum attraction costs for the day (assumed per person)
        const sum_attractions = (quotation.doc.attractions || []).filter((att) => att.day === day).reduce((sum, att) => sum + (att.cost || 0), 0);

        // Set min_price (lowest per person cost) and max_price (highest per person cost)
        a.min_price = vehicle_per_min + staff_per_min + sum_tourist + sum_activities + sum_attractions;
        a.max_price = vehicle_per_max + staff_per_max + sum_tourist + sum_activities + sum_attractions;
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
const AccommodationColumns = [
    {
        title: 'Accomodation',
        key: 'accomodation',
        dataIndex: 'accomodation',
    },
    {
        title: 'Meal',
        key: 'meal',
        dataIndex: 'meal',
    },
    {
        title: 'Hotel',
        key: 'hotel',
        dataIndex: 'hotel',
    },
    // {
    //     title: 'Vehicle',
    //     key: 'vehicle',
    //     dataIndex: 'vehicle',
    // },
    // {
    //     title: 'Staff',
    //     key: 'staff',
    //     dataIndex: 'staff',
    // },
    {
        title: 'Staff Accomodation',
        key: 'staff_accomodation',
        dataIndex: 'staff_accomodation',
    },
    {
        title: 'Total',
        key: 'total',
        dataIndex: 'total',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    },
]

const ActivityColumns = [
    {
        title: 'Activity Name',
        key: 'activity_name',
        dataIndex: 'activity_name',
    },
    {
        title: 'Cost',
        key: 'cost',
        dataIndex: 'cost',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    },
]
const AttractionColumns = [
    {
        title: 'Attraction Name',
        key: 'attraction',
        dataIndex: 'attraction',
    },
    {
        title: 'Cost',
        key: 'cost',
        dataIndex: 'cost',
    },
    {
        title: 'Action',
        key: 'Action',
        dataIndex: 'Action',
    },
]



</script>