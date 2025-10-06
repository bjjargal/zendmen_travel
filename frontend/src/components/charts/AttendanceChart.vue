<template>
    <a-card>
        <div>Миний ирц</div>
        <a-menu v-model:selectedKeys="selectedTab" mode="horizontal" :items="tabItems"
            style="background-color: transparent; border: none;" />
        <a-spin :spinning="chartData.list.loading" tip="Loading...">
            <!-- <div v-if="chartData.error" class="mt-5 text-red-500 text-center">
                Алдаа: {{ chartData.error.message || 'Өгөгдөл ачаалж чадахгүй байна.' }}
            </div>
            <div v-else-if="chartData.data.length === 0" class="mt-5 text-center text-gray-500">
                Өгөгдөл олдсонгүй.
            </div> -->
            <div class="mt-5 w-full relative">
                <div class="absolute bottom-5 left-0 right-0 h-0.5 bg-[#E6E6E6] z-0"></div>
                <div class="flex flex-nowrap w-full h-[200px]">
                    <OneDayChart v-for="day in chartData.data" :key="day.attendance_date" :data="day"
                        :is-month-view="selectedTab[0] === 30" :max-working-hours="maxWorkingHours"
                        :bar-width="barWidth" :min-bar-width="minBarWidth" />
                </div>
            </div>
        </a-spin>

        <div class="mt-5 flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#82e0aa]"></div>
                <div>Илүү цаг</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#fdebd0]"></div>
                <div>Эрт тарсан</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#E6E6E6]"></div>
                <div>Амралт</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#D92F29]"></div>
                <div>Тасалсан</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#394CFF]"></div>
                <div>Чөлөөтэй</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#F1811B]"></div>
                <div>Ажилсан цаг</div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-full size-3 bg-[#b0bec5]"></div>
                <div>Хоцорсон</div>
            </div>
        </div>
    </a-card>
</template>
<script setup>
import OneDayChart from '@/components/charts/OneDayChart.vue';
import { computed, ref, watch } from 'vue';
import { createListResource, createResource } from 'frappe-ui';
import { useRouter } from 'vue-router';
import { sessionStore } from '@/data/session';

const props = defineProps({
    employee: { type: String, required: true }
});

const router = useRouter();
const selectedTab = ref([7]);
const tabItems = [
    { key: 7, label: '7 хоног' },
    { key: 30, label: '1 сар' }
];
const session = sessionStore()

const maxWorkingHours = ref(8 * 3600); // Default 8 hours in seconds

const numDays = computed(() => selectedTab.value[0]);
const barWidth = computed(() => `calc(100% / ${numDays.value})`);
const minBarWidth = computed(() => numDays.value === 30 ? '40px' : '80px');



const chartData = createListResource({
    doctype: 'Attendance',
    fields: [
        'in_time',
        'out_time',
        'attendance_date',
        'late_duration',
        'early_duration',
        'leave_duration',
        'overtime_duration',
        'status',
        'working_hours',
    ],
    filters: { employee: props.employee },
    pageLength: selectedTab.value[0],
    orderBy: 'attendance_date desc',
    auto: true,
    transform(data) {
        return data.reverse();
    },
    onError(error) {
        if (error?.exc_type === 'AuthenticationError') {
            router.push('/login');
        }
    }
});

console.log(chartData)

watch(selectedTab, () => {
    chartData.update({ pageLength: selectedTab.value[0] });
    chartData.reload();
});
</script>