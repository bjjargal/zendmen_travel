<template>
    <a-tooltip placement="right" color="black">
        <template #title>
            <div class=" text-white text-xs rounded p-2 w-48 z-10 shadow-lg">
                <div class="text-center font-semibold mb-2">{{ formatDate(props.data.attendance_date) }}</div>
                <div v-if="props.data.is_holiday" class="text-xl text-center text-yellow-200 mb-2">
                    Амралтын өдөр
                </div>
                <div v-else class="space-y-2">
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Нрсэн цаг</span>
                        <span class="font-mono">{{ props.data.in_time ? getTime(props.data.in_time) : '-' }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Явсан цаг</span>
                        <span class="font-mono">{{ props.data.out_time ? getTime(props.data.out_time) : '-' }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Чөлөө</span>
                        <span>{{ formatDuration(props.data.leave_duration) }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Ажилсан цаг</span>
                        <span class="font-semibold">{{ formatDuration(props.data.working_hours) }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Илүү цаг</span>
                        <span class="text-green-200">{{ formatDuration(props.data.overtime_duration) }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Хоцорсон</span>
                        <span class="text-yellow-200">{{ formatDuration(props.data.late_duration) }}</span>
                    </div>
                    <div class="flex justify-between border-b border-blue-400 pb-1">
                        <span>Эрт тарсан</span>
                        <span class="text-orange-200">{{ formatDuration(props.data.early_duration) }}</span>
                    </div>
                    <div v-if="props.data.status"
                        class="flex justify-between pt-1 border-t border-blue-400 font-medium">
                        <span>Статус</span>
                        <span :class="getStatusClass(props.data.status)">{{ getStatusLabel(props.data.status) }}</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex flex-col justify-end rounded overflow-hidden gap-0.5 relative h-full px-1 transition-all duration-200 hover:scale-[1.02]"
            :style="{ width: props.barWidth, minWidth: props.minBarWidth }">
            <div class="h-[200px] flex flex-col justify-end rounded overflow-hidden gap-0.5 relative">
                <!-- Calculate total deduction/addition to cap stack height -->
                <div v-if="props.data.late_duration > 0"
                    class="bg-[#b0bec5] rounded w-full transition-height duration-300"
                    :style="{ height: `${getHeight(props.data.late_duration, props.maxWorkingHours)}%` }"
                    :title="`Хоцорсон: ${formatDuration(props.data.late_duration)}`" />
                <div v-if="props.data.working_hours > 0"
                    class="bg-[#F1811B] rounded w-full transition-height duration-300"
                    :style="{ height: `${getHeight(props.data.working_hours, props.maxWorkingHours)}%` }"
                    :title="`Ажилсан: ${formatDuration(props.data.working_hours)}`" />
                <div v-if="props.data.leave_duration > 0"
                    class="bg-[#394CFF] rounded w-full transition-height duration-300"
                    :style="{ height: `${getHeight(props.data.leave_duration, props.maxWorkingHours)}%` }"
                    :title="`Чөлөө: ${formatDuration(props.data.leave_duration)}`" />
                <div v-if="props.data.early_duration > 0 && !props.data.is_holiday && props.data.status !== 'Absent'"
                    class="bg-[#fdebd0] rounded w-full transition-height duration-300"
                    :style="{ height: `${getHeight(props.data.early_duration, props.maxWorkingHours)}%` }"
                    :title="`Эрт тарсан: ${formatDuration(props.data.early_duration)}`" />
                <div v-if="props.data.overtime_duration > 0"
                    class="bg-[#82e0aa] rounded w-full transition-height duration-300"
                    :style="{ height: `${getHeight(props.data.overtime_duration, props.maxWorkingHours)}%` }"
                    :title="`Илүү цаг: ${formatDuration(props.data.overtime_duration)}`" />
                <!-- Overlays with reduced opacity for better visibility of underlying bars if needed -->
                <div v-if="props.data.status === 'Absent'"
                    class="bg-[#D92F29]/90 rounded w-full absolute inset-0 transition-opacity duration-300"
                    style="z-index: 10;" :title="'Тасалсан'" />
                <div v-else-if="props.data.is_holiday"
                    class="bg-[#E6E6E6]/90 rounded w-full absolute inset-0 transition-opacity duration-300"
                    style="z-index: 10;" :title="'Амралт'" />
            </div>
            <div class="text-sm text-center mt-2 px-1 truncate font-medium">
                {{ props.isMonthView ? getDay(props.data.attendance_date) : formatDate(props.data.attendance_date) }}
            </div>
        </div>
    </a-tooltip>
</template>
<script setup>
const props = defineProps({
    data: { type: Object, required: true },
    isMonthView: { type: Boolean, default: false },
    maxWorkingHours: { type: Number, default: 8 * 3600 },
    barWidth: { type: String, default: 'calc(100% / 7)' },
    minBarWidth: { type: String, default: '80px' }
});

const getTime = (datetime) => datetime.substring(11, 16);

const getDay = (date) => new Date(date).getDate().toString().padStart(2, '0');

const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('mn-MN', { day: 'numeric', month: 'short' });
};

const getHeight = (seconds, max) => {
    if (max <= 0) return 0;
    return Math.min((seconds / max) * 100, 100);
};

const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0 минут';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours} цаг `;
    if (minutes > 0 || hours === 0) result += `${minutes} минут`;
    return result.trim();
};

const getStatusLabel = (status) => {
    const labels = {
        Present: 'Ирсэн',
        Absent: 'Тасалсан',
        Half: 'Хагас өдөр',
        'On Leave': 'Чөлөө',
        'Half Day': 'Хагас өдөр'
    };
    return labels[status] || status;
};

const getStatusClass = (status) => {
    const classes = {
        Present: 'text-green-200',
        Absent: 'text-red-200',
        Half: 'text-yellow-200',
        'On Leave': 'text-blue-200',
        'Half Day': 'text-yellow-200'
    };
    return classes[status] || 'text-gray-200';
};
</script>