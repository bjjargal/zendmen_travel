<template>
    <a-page-header class="!p-0 !mb-2" :title="tour?.doc?.tour_name || 'tour'" @back="() => $router.go(-1)">
        <template #extra>
            <a-button @click="tour.save.submit()" :loading="!!tour?.save?.loading" type="primary">
                Хадгалах
            </a-button>
        </template>
    </a-page-header>
    <a-spin v-if="tour.get.loading">Loading</a-spin>
    <div v-else class="w-full h-full bg-white flex">
        <div class=" w-[25%] h-full p-2 flex flex-col gap-1 border-r">
            <FileUploader :fileTypes="['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']" :multiple="false"
                @success="handleFileUpload" class="border-none p-0">
                <template #default="{ openFileSelector }">
                    <div class="rounded overflow-hidden" @click="openFileSelector">
                        <img v-if="tour.doc.image" :src="tour.doc.image" alt="avatar" />
                        <div v-else>
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </div>
                </template>
            </FileUploader>
            <a-form layout="vertical" class="">
                <a-form-item :colon="false" labelAlign="left" label="Tour name">
                    <a-input type="text" v-model:value="tour.doc.tour_name" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Duration">
                    <a-input-number class="!w-full" v-model:value="tour.doc.duration" :min="1" :max="20" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Category">
                    <a-select :options="[
                        { label: 'Budget', value: 'Budget' },
                        { label: 'Luxury', value: 'Luxury' },
                        { label: 'Comfort', value: 'Comfort' },
                    ]" v-model:value="tour.doc.category" />
                </a-form-item>
            </a-form>
        </div>
        <div class="flex-1 p-2">
            <a-form layout="vertical" class="">
                <a-form-item :colon="false" labelAlign="left" label="Activities">
                    <a-tabs class="" v-model:activeKey="current" tab-position="top" type="card">
                        <a-tab-pane v-for="day in tour.doc.duration" :key="day" :tab='day'>
                            <div class="grid grid-cols-4 gap-2">
                                <a-form-item :colon="false" labelAlign="" label="Destination">
                                    <a-select :options="destinations.data" :value="getDayDestination(day)"
                                        @change="(val) => setDayDestination(val, day)">
                                    </a-select>
                                </a-form-item>
                                <a-form-item :colon="false" labelAlign="" label="Tour Accomodation">
                                    <a-select :options="[{
                                        value: 'Camping'
                                    }, {
                                        value: 'Hotel'
                                    }

                                    ]" :value="getDayAccom(day)" @change="(val) => setDayAccom(val, day)">
                                    </a-select>
                                </a-form-item>
                                <a-form-item :colon="false" labelAlign="" label="Price">
                                    <a-input-number class="!w-full" :value="getDayPrice(day)"
                                        @change="(val) => setDayPrice(val, day)" :min="0" :max="10000" />
                                </a-form-item>
                            </div>
                            <a-table :dataSource="tableData" :columns="columns" row-key="name" bordered size="small"
                                :pagination="false" :locale="{ emptyText: 'Мэдээлэл байхгүй байна' }" />

                        </a-tab-pane>
                    </a-tabs>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
import { createDocumentResource, FileUploader } from 'frappe-ui';
import { ref, computed, watch } from 'vue';
import { DestinationStore } from '@/data/destinations';
// import { AccommodationStore } from '@/data/accommodations';

const { destinations } = DestinationStore();
// const { accommodations } = AccommodationStore();

// console.log('Destinations value:', destinations.value);
// console.log('Accommodations value:', accommodations.value);

const props = defineProps({
    name: {
        type: String,
        required: true
    }
});

const tour = createDocumentResource({
    doctype: 'Tour',
    name: props.name,
    auto: true
});

const handleFileUpload = (file) => {
    tour.doc.image = file.file_url;
};
console.log(tour.doc)
const columns = [
    {
        title: 'Activity Name',
        dataIndex: 'activity_name',
    },
    {
        title: 'Cost',
        dataIndex: 'cost',
    },
];

const current = ref(1);


const getDayDestination = (day) => {
    const acts = tour.doc.accomodation?.filter(a => a.day === day) || [];
    return acts.length > 0 ? acts[0].destination || '' : '';
};

const setDayDestination = (value, day) => {
    const acts = tour.doc.accomodation?.filter(a => a.day === day) || [];
    acts.forEach(a => {
        a.destination = value;
    });
    if (acts.length === 0 && value) {
        const newAct = {
            doctype: "Tour Activities",
            parent: tour.doc.name || '',
            parentfield: "activities",
            parenttype: "Tour",
            day: day,
            activity_name: `Day ${day} Overview`,
            cost: 0,
            destination: value,
            idx: (tour.doc.activities?.length || 0) + 1
        };
        tour.doc.activities.push(newAct);
    }
};

const getDayAccom = (day) => {
    const accom = tour.doc.accomodation?.find(a => a.day === day);
    return accom?.accommodation_name || '';
};

const setDayAccom = (value, day) => {
    let accom = tour.doc.accomodation?.find(a => a.day === day);
    if (value) {
        if (!accom) {
            accom = {
                doctype: "Tour Accommodation",
                parent: tour.doc.name || '',
                parentfield: "accomodation",
                parenttype: "Tour",
                day: day,
                accommodation_name: value,
                idx: (tour.doc.accomodation?.length || 0) + 1
            };
            tour.doc.accomodation.push(accom);
        } else {
            accom.accommodation_name = value;
        }
    } else if (accom) {
        const idx = tour.doc.accomodation.indexOf(accom);
        if (idx > -1) {
            tour.doc.accomodation.splice(idx, 1);
        }
    }
};

const getDayPrice = (day) => {
    const acts = tour.doc.accomodation?.filter(a => a.day === day) || [];
    return acts.reduce((sum, a) => sum + (a.cost || 0), 0);
};

const setDayPrice = (value, day) => {
    if (value === undefined || value < 0) return;
    const acts = tour.doc.accomodation?.filter(a => a.day === day) || [];
    const currentSum = getDayPrice(day);
    const delta = value - currentSum;
    if (acts.length > 0) {
        acts[0].cost = (acts[0].cost || 0) + delta;
    } else if (value > 0) {
        const newAct = {
            doctype: "Tour Activities",
            parent: tour.doc.name || '',
            parentfield: "activities",
            parenttype: "Tour",
            day: day,
            activity_name: `Day ${day} Activity`,
            cost: value,
            idx: (tour.doc.activities?.length || 0) + 1
        };
        tour.doc.activities.push(newAct);
    }
};

const tableData = computed(() => {
    return tour.doc.activities?.filter(activity => activity.day === current.value) || [];
});
</script>