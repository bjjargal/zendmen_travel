<template>
    <div v-if="isVisible">
        <a-select v-if="field.fieldtype === 'Select'" :value="model[field.fieldname]" :options="fieldOptions"
            allow-clear :disabled="!!field.read_only" :placeholder="field.label || 'Сонгоно уу'"
            @update:value="handleUpdate(field.fieldname, $event)" />
        <a-select v-else-if="field.fieldtype === 'Link'" :value="model[field.fieldname]" :options="linkOptions"
            allow-clear :disabled="!!field.read_only" :placeholder="field.label || 'Сонгоно уу'"
            @update:value="handleUpdate(field.fieldname, $event)" />
        <a-date-picker v-else-if="field.fieldtype === 'Date' || field.fieldtype === 'Datetime'"
            :value="model[field.fieldname]" :placeholder="field.fieldtype === 'Date' ? 'Огноо' : 'Огноо ба цаг'"
            :show-time="field.fieldtype === 'Datetime' ? { format: 'HH:mm' } : false"
            :format="field.fieldtype === 'Datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'" :disabled="!!field.read_only"
            :value-format="field.fieldtype === 'Datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'" style="width: 100%"
            @update:value="handleUpdate(field.fieldname, $event)" />
        <a-textarea
            v-else-if="field.fieldtype === 'Small Text' || field.fieldtype === 'Text' || field.fieldtype === 'Long Text'"
            :value="model[field.fieldname]" :rows="field.fieldtype === 'Long Text' ? 5 : 3"
            :disabled="!!field.read_only" :placeholder="field.label || 'Тайлбар'"
            @update:value="handleUpdate(field.fieldname, $event)" />
        <a-checkbox v-else-if="field.fieldtype === 'Check'" :checked="!!model[field.fieldname]"
            :disabled="!!field.read_only" @update:checked="handleUpdate(field.fieldname, $event)">
            {{ field.label || 'Сонголт' }}
        </a-checkbox>
        <a-input-number v-else-if="field.fieldtype === 'Int' || field.fieldtype === 'Float'"
            :value="model[field.fieldname]" :step="field.fieldtype === 'Float' ? 0.01 : 1" style="width: 100%"
            :placeholder="field.label || 'Тоо'" :disabled="!!field.read_only"
            @update:value="handleUpdate(field.fieldname, $event)" />
        <a-input v-else-if="field.fieldtype === 'Duration'" :value="formattedDuration" :disabled="!!field.read_only"
            :placeholder="field.label || 'Хугацаа'"
            @update:value="handleUpdate(field.fieldname, parseDuration($event))" />
        <a-time-picker v-else-if="field.fieldtype === 'Time'" :value="model[field.fieldname]" style="width: 100%"
            format="HH:mm" valueFormat="HH:mm" :disabled="!!field.read_only"
            @update:value="handleUpdate(field.fieldname, $event)" />

        <a-input v-else :value="model[field.fieldname]" :disabled="!!field.read_only"
            :placeholder="field.label || 'Текст'" @update:value="handleUpdate(field.fieldname, $event)" />
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    field: {
        type: Object,
        required: true
    },
    model: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['change']);

const formattedDuration = computed({
    get() {
        const seconds = props.model[props.field.fieldname];
        if (seconds === 0) {
            return '0 цаг';
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const parts = [];
        if (hours > 0) {
            parts.push(`${hours} цаг`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} минут`);
        }
        return parts.join(' ');
    },
    set() {
        // No setter needed; handled in @update:value
    }
});

const fieldOptions = computed(() => {
    let opts = props.field._custom_options || props.field.options || '';
    if (Array.isArray(opts)) {
        return opts.map(opt => ({
            label: opt,
            value: opt
        }));
    }
    return (opts ? opts.split('\n') : []).map(opt => ({
        label: opt,
        value: opt
    }));
});

const linkOptions = computed(() => {
    const opts = props.field._custom_options || props.field.options || [];
    if (typeof opts === 'string') {
        return [];
    }
    if (Array.isArray(opts)) {
        return opts.map(opt => ({
            label: opt,
            value: opt
        }));
    }
    return [];
});

const isVisible = computed(() => {
    if (!props.field.depends_on) return true;
    if (props.field.depends_on.startsWith('eval:')) {
        const expr = props.field.depends_on.slice(5); // remove 'eval:'
        try {
            const fn = new Function('doc', `return ${expr}`);
            const result = fn(props.model);
            return !!result;
        } catch (error) {
            console.error('Error evaluating depends_on:', error);
            return true; // default to visible on error
        }
    }
    return true; // for other types, show
});

// Unified handler for all field updates (avoids v-model conflicts with form)
function handleUpdate(fieldname, value) {
    props.model[fieldname] = value;
    emit('change', value);
}

// Parse formatted duration back to seconds
function parseDuration(str) {
    if (!str || typeof str !== 'string') return 0;
    let totalSeconds = 0;
    const hoursMatch = str.match(/(\d+)\s*цаг/i);
    const minutesMatch = str.match(/(\d+)\s*минут/i);
    if (hoursMatch) totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
    if (minutesMatch) totalSeconds += parseInt(minutesMatch[1], 10) * 60;
    return totalSeconds;
}
</script>