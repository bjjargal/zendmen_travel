<template>
    <a-page-header class="!p-0 !mb-2" :title="tour?.doc?.tour_name || 'tour'" @back="() => $router.go(-1)">
        <template #extra>
            <a-button @click="saveDoc()" :loading="!!tour?.save?.loading" type="primary">
                Save
            </a-button>
        </template>
    </a-page-header>
    <a-spin v-if="tour.get.loading">Loading</a-spin>
    <div v-else class="w-full h-full bg-white flex">
        <div class=" w-[25%] h-full p-2 flex flex-col gap-1 border-r">
            <a-form layout="vertical" class="w-full">
                <a-form-item :colon="false" labelAlign="left" label="Tour name">
                    <a-input type="text" v-model:value="tour.doc.tour_name" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Subtitle">
                    <a-textarea v-model:value="tour.doc.sub_title" :row="6" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Duration">
                    <a-input-number class="!w-full" v-model:value="tour.doc.duration" :min="1" :max="20"
                        addon-after="Days" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Difficulty">
                    <a-select :options="[{ value: 'Easy-Moderate' }]" v-model:value="tour.doc.difficulty" />
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Group size">
                    <a-space>
                        <a-input-number v-model:value="tour.doc.min_people" :min="1" :max="20" addon-before="min" />
                        <a-input-number v-model:value="tour.doc.max_people" :min="1" :max="20" addon-before="max" />
                    </a-space>
                </a-form-item>
                <a-form-item :colon="false" labelAlign="left" label="Total Distance">
                    <a-input-number v-model:value="tour.doc.total_distance" addon-after="km"
                        class="!w-full"></a-input-number>
                </a-form-item>


            </a-form>
        </div>
        <div class="flex-1 p-2">
            <a-form layout="vertical" class="">
                <a-form-item :colon="false" labelAlign="left">
                    <a-tabs class="" v-model:activeKey="current" tab-position="top" type="card">
                        <a-tab-pane v-for="day in tour.doc.duration" :key="day" :tab='day'>
                            <div class="grid grid-cols-3 gap-2">
                                <a-form-item v-if="destinationOptions.length > 0" :colon="false" labelAlign=""
                                    label="Destination">
                                    <a-select :options="destinationOptions" v-model:value="accomDestination"
                                        :loading="destinations.list.loading" show-search :filter-option="filterOption"
                                        allow-clear />
                                </a-form-item>
                                <a-form-item :colon="false" labelAlign="" label="Tour Accomodation">
                                    <a-select :options="[{
    label: 'Camping',
    value: 'Camping'
}, {
    label: 'Hotel',
    value: 'Hotel'
    }]" v-model:value="accomType" />
                                </a-form-item>
                                <a-form-item :colon="false" labelAlign="" label="Price">
                                    <a-input-number class="!w-full" v-model:value="accomPrice" />
                                </a-form-item>
                            </div>
                            <a-table :dataSource="tableData" :columns="columns" row-key="name" bordered size="small"
                                :pagination="false" :locale="{ emptyText: 'Мэдээлэл байхгүй байна' }">
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.dataIndex === 'activity_name'">
                                        <a-select v-model:value="record.activity_name"
                                            :options="activityOptions"></a-select>
                                    </template>
                                    <template v-else-if="column.dataIndex === 'cost'">
                                        <a-input-number v-model:value="record.cost" class="!w-full" />
                                    </template>
                                </template>
                            </a-table>
                            <a-button class="mt-2" @click="addActivity(day)">Add activity</a-button>

                        </a-tab-pane>
                    </a-tabs>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
import { createDocumentResource, FileUploader } from 'frappe-ui';
import { ref, computed, onMounted } from 'vue';
import { DestinationStore } from '@/data/destinations';
import { ActivityStore } from '@/data/Activities';
import { message } from 'ant-design-vue';



const props = defineProps({
    name: {
        type: String,
        required: true
    }
});

const isDataLoaded = ref(false);
const { destinations } = DestinationStore();
const { activities } = ActivityStore()



const filterOption = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase())
}
const destinationOptions = computed(() => {
    return destinations?.data?.map(d => ({
        value: d.name,
        label: d.destination_name
    })) || []
})

const activityOptions = computed(() => {
    return activities?.data?.map(d => ({
        value: d.name,
        label: d.activity_name
    })) || []
})




const tour = createDocumentResource({
    doctype: 'Tour',
    name: props.name,
    auto: true
});
console.log(tour.doc)


const handleFileUpload = (file) => {
    tour.doc.image = file.file_url;
};

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

const updateAccomodation = (field, value) => {
    let accomArray = tour.doc.accomodation || [];
    let index = accomArray.findIndex(a => a.day === current.value);
    let entry = index >= 0 ? { ...accomArray[index] } : { day: current.value };
    entry[field] = value;
    if (index >= 0) {
        accomArray[index] = entry;
    } else {
        accomArray.push(entry);
    }
    tour.doc.accomodation = accomArray;
};

const accomDestination = computed({
    get() {
        const acts = tour.doc.accomodation?.filter(a => a.day === current.value) || [];
        return acts.length > 0 ? acts[0].destination : '';
    },
    set(value) {
        updateAccomodation('destination', value);
    }
});

const accomType = computed({
    get() {
        const acts = tour.doc.accomodation?.filter(a => a.day === current.value) || [];
        return acts.length > 0 ? acts[0].accomodation : '';
    },
    set(value) {
        updateAccomodation('accomodation', value);
    }
});

const accomPrice = computed({
    get() {
        const acts = tour.doc.accomodation?.filter(a => a.day === current.value) || [];
        return acts.length > 0 ? acts[0].price : 0;
    },
    set(value) {
        updateAccomodation('price', value);
    }
});

const tableData = computed(() => {
    return tour.doc.activities?.filter(activity => activity.day === current.value) || [];
});

const addActivity = (day) => {
    tour.doc.activities.push({
        day: day,
        activity_name: '',
        cost: 0

    })
}


const saveDoc = async () => {
    try {
        tour.save.submit()
        message.success('Successflly saved', 2)
    }
    catch (error) {
        message.error(error.message, 2)
    }
}

onMounted(async () => {
    await destinations.list.promise;
    await activities.list.promise;
    isDataLoaded.value = true;
});
</script>