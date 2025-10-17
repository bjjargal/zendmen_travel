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
                    <a-textarea v-model:value="tour.doc.sub_title" :rows="6" />
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
                        <a-tab-pane v-for="day in tour.doc.duration" :key="day" :tab="`Day ${day}`">
                            <div v-for="(a, idx) in tour.doc.accomodation.filter(acc => acc.day === day)" :key="idx"
                                class="!grid grid-cols-4 gap-2">
                                <a-form-item label="title">
                                    <a-input type="text" v-model:value="a.title" />
                                </a-form-item>
                                <a-form-item label="Destination">
                                    <a-select :options="destinationOptions" v-model:value="a.destination" allow-clear />
                                </a-form-item>
                                <a-form-item label="Difficulty">
                                    <a-select :options="difficultyOptions" v-model:value="a.difficulty" allow-clear />
                                </a-form-item>
                                <a-form-item label="Accomodation">
                                    <a-select :options="accomodationOptions" v-model:value="a.accomodation"
                                        allow-clear />
                                </a-form-item>
                                <a-form-item label="Distance">
                                    <a-input-number v-model:value="a.distance" allow-clear class="!w-full"
                                        addon-after="km" />
                                </a-form-item>
                                <a-form-item label="Drive Time">
                                    <a-input-number v-model:value="a.drive_time" allow-clear class="!w-full"
                                        addon-after="hours" />
                                </a-form-item>
                                <a-form-item label="Terrain">
                                    <a-select :options="terrainOptions" v-model:value="a.terrain" allow-clear />
                                </a-form-item>
                                <a-form-item label="Altitude">
                                    <a-input-number v-model:value="a.altitude" allow-clear class="!w-full"
                                        addon-after="km" />
                                </a-form-item>
                                <a-form-item label="Meals" class="">
                                    <a-space direction="vertical">
                                        <a-checkbox :checked="!!a.breakfast"
                                            @update:checked="a.breakfast = !a.breakfast">Breakfast</a-checkbox>
                                        <a-checkbox :checked="!!a.lunch"
                                            @update:checked="a.lunch = !a.lunch">Lunch</a-checkbox>
                                        <a-checkbox :checked="!!a.dinner"
                                            @update:checked="a.dinner = !a.dinner">Dinner</a-checkbox>
                                    </a-space>
                                </a-form-item>
                                <a-form-item label="Activities" class="">
                                    <a-checkbox-group v-model:value="dayActivity"
                                        :options="getActivityOptions(a.destination)" />
                                </a-form-item>
                            </div>
                            <a-form-item label="Notes">
                                <a-table :columns="noteColumns" :pagination="false" :data-source="notes" size="small">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'note'">
                                            <a-textarea :rows="1" v-model:value="record.note" />
                                            {{ record.node }}
                                        </template>
                                        <template v-else>
                                            <div class="flex gap-2">
                                                <a-button @click="deleteNote(record)" danger
                                                    size="small">Delete</a-button>
                                            </div>
                                        </template>
                                    </template>
                                </a-table>
                                <a-button class="mt-2" @click="addNote">add note</a-button>
                            </a-form-item>
                        </a-tab-pane>
                    </a-tabs>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
import { createDocumentResource } from 'frappe-ui';
import { ref, computed, watch } from 'vue';
import { DestinationStore } from '@/data/destinations';
import { ActivityStore } from '@/data/Activities';
import { message } from 'ant-design-vue';
import { ActivityDesStore } from '@/data/ActivityDestination';
const props = defineProps({
    name: {
        type: String,
        required: true
    }
});

const { destinations } = DestinationStore();
const { activities } = ActivityStore()
const { activitiesDes } = ActivityDesStore()

const destinationOptions = computed(() => {
    return destinations?.data?.map(d => ({
        value: d.name,
        label: d.destination_name
    })) || []
})

const noteColumns = [
    { title: 'Note', dataIndex: 'note' },
    { title: 'Action', dataIndex: 'Action', key: 'Action' }
]

const difficultyOptions = [
    { value: 'Easy', },
    { value: 'Moderate', },
    { value: 'Challenging' }
]

const accomodationOptions = [
    { value: 'Camping' },
    { value: 'Hotel' },
    { value: 'Ger Camp' }
]

const terrainOptions = [
    { value: "Paved roads" },
    { value: "Paved & gravel" },
    { value: "Mixed paved & dirt" },
    { value: "Desert tracks" },
    { value: "Mountain roads" }
]

const tour = createDocumentResource({
    doctype: 'Tour',
    name: props.name,
    auto: true
});
console.log(activitiesDes.data)

const getActivityOptions = (destination) => {
    return activitiesDes?.data[destination] || []
}

const dayActivity = computed({
    get() {
        const dayacts = tour.doc.activities?.filter(n => n.day === current.value) || []
        return dayacts.map(a => a.activity_name)
    },
    set(newNames) {
        if (!Array.isArray(tour.doc.activities)) {
            tour.doc.activities = []
        }

        const currentDay = current.value
        const existingActivities = tour.doc.activities.filter(n => n.day === currentDay)
        const existingNames = existingActivities.map(a => a.activity_name)

        // 1️⃣ Add new checked ones
        newNames.forEach(name => {
            if (!existingNames.includes(name)) {
                tour.doc.activities.push({
                    day: currentDay,
                    activity_name: name,
                    parent: tour.doc.name,
                    parenttype: 'Tour',
                    parentfield: 'activities',
                })
            }
        })

        // 2️⃣ Remove unchecked ones
        tour.doc.activities = tour.doc.activities.filter(a => {
            if (a.day !== currentDay) return true // keep other days
            return newNames.includes(a.activity_name) // keep only checked ones
        })
    }
})




const current = ref(1);
watch(
    () => tour?.doc?.duration,
    (duration) => {
        for (let i = 1; i <= duration; i++) {
            const exists = tour.doc.accomodation.some(a => a.day === i)
            if (!exists) {
                tour.doc.accomodation.push({
                    day: i,
                    title: '',
                    destination: null,
                    difficulty: null,
                    accomodation: null,
                    distance: null,
                    drive_time: null,
                    terrain: null,
                    altitude: null,
                    parent: tour.doc.name,       // 👈 important
                    parenttype: 'Tour',          // 👈 important
                    parentfield: 'accomodation', // 👈 important
                    doctype: 'Tour Accomodation' // 👈 child table doctype
                })
            }
        }
    },
    { immediate: true }
)

const notes = computed(() => {
    return tour.doc.notes?.filter(n => n.day === current.value) || []
})

const addNote = () => {
    tour.doc.notes.push({
        day: current.value,
        note: '',
        parent: tour.doc.name,       // 👈 Add for child table
        parenttype: 'Tour',          // 👈 Add for child table
        parentfield: 'notes',        // 👈 Add for child table (adjust if field name differs)
        doctype: 'Tour Note'         // 👈 Add: replace with actual child doctype (e.g., 'Tour Note')
    })
}
const deleteNote = (note) => {
    if (!tour.doc.notes || !Array.isArray(tour.doc.notes)) return
    if (note.name) {
        tour.doc.notes = tour.doc.notes.filter(n => n.name !== note.name)
    } else {
        tour.doc.notes = tour.doc.notes.filter(n => n !== note)
    }
    message.success('Note deleted')
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
</script>