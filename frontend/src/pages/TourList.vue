<template>
    <a-page-header class="!p-0 !mb-2" title="Guide">
        <template #extra>
            <a-button type="primary" @click="open = true">Create tour</a-button>
        </template>
    </a-page-header>
    <a-empty v-if="!tours.data || tours.data.length === 0" class="w-full" description="No tours available" />
    <div v-else class="grid grid-cols-4 gap-4 p-4">
        <a-card v-for="tour in tours.data" :key="tour.name" hoverable
            @click="router.push({ name: 'Tour', params: { name: tour.name } })">
            <template #cover>
                <img class="h-80 w-full object-cover" alt="image" :src="tour.image || '/placeholder.jpg'" />
            </template>
            <a-card-meta :title="tour.tour_name">
                <template #description>
                    <a-tag color="blue">{{ tour.category }}</a-tag>
                    <a-tag color="orange">{{ tour.duration }} days</a-tag>
                </template>
            </a-card-meta>
        </a-card>
    </div>

    <a-modal v-model:open="open" title="Create New Tour" @ok="handleCreate" @cancel="handleCancel"
        :confirm-loading="creating">
        <a-form ref="createFormRef" :model="newTour" :rules="formRules" layout="vertical">
            <a-form-item label="Tour name" name="tour_name">
                <a-input v-model:value="newTour.tour_name" placeholder="Enter tour name" />
            </a-form-item>
            <a-form-item label="Duration" name="duration">
                <a-input-number class="!w-full" v-model:value="newTour.duration" :min="1" :max="20"
                    placeholder="Enter duration" />
            </a-form-item>
            <a-form-item label="Category" name="category">
                <a-select v-model:value="newTour.category" placeholder="Select category">
                    <a-select-option value="Budget">Budget</a-select-option>
                    <a-select-option value="Luxury">Luxury</a-select-option>
                    <a-select-option value="Comfort">Comfort</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <FileUploader :fileTypes="['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']" :multiple="false"
            @success="handleFileUpload" class="border-none p-0">
            <template #default="{ openFileSelector }">
                <div class="rounded overflow-hidden cursor-pointer" @click="openFileSelector">
                    <img v-if="newTour.image" :src="newTour.image" alt="avatar" class="w-full h-48 object-cover" />
                    <div v-else class="h-48 bg-gray-200 flex items-center justify-center">
                        <div class="ant-upload-text">Upload Image</div>
                    </div>
                </div>
            </template>
        </FileUploader>
    </a-modal>
</template>
<script setup>
import { createListResource, FileUploader } from 'frappe-ui';
import { ref, reactive, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const open = ref(false);
const createFormRef = ref();
const creating = ref(false);

const tours = createListResource({
    doctype: 'Tour',
    fields: ['name', 'tour_name', 'image', 'duration', 'category'],
    auto: false
});

const newTour = reactive({
    tour_name: '',
    duration: 1,
    category: '',
    image: ''
});

const formRules = {
    tour_name: [{ required: true, message: 'Please enter tour name' }],
    duration: [{ required: true, message: 'Please enter duration' }],
    category: [{ required: true, message: 'Please select category' }]
};

const handleFileUpload = (file) => {
    newTour.image = file.file_url;
};

const handleCreate = async () => {
    try {
        await createFormRef.value.validate();
        creating.value = true;
        await tours.insert.submit({ ...newTour });
        message.success('Tour created successfully', 2);
        newTour.tour_name = '';
        newTour.duration = 1;
        newTour.category = '';
        newTour.image = '';
        open.value = false;
        await nextTick(() => createFormRef.value.resetFields());
        await tours.reload();
    } catch (error) {
        if (error.errorFields) {
            message.error('Please fix the errors below', 2);
        } else {
            message.error('Failed to create tour: ' + (error.message || error), 2);
        }
    } finally {
        creating.value = false;
    }
};

const handleCancel = () => {
    newTour.tour_name = '';
    newTour.duration = 1;
    newTour.category = '';
    newTour.image = '';
    open.value = false;
    createFormRef.value.resetFields();
};

onMounted(async () => {
    await tours.fetch();
});
</script>