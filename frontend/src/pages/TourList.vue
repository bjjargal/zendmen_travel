<template>
	<div class="min-h-screen">
		<a-page-header class="!p-0 mb-5 py-3 sticky top-0 z-10" title="Tour">
			<template #extra>
				<a-button type="primary" @click="open = true">Create Tour</a-button>
			</template>
		</a-page-header>

		<a-empty
			v-if="!tours.data || tours.data.length === 0"
			class="w-full mt-20"
			description="No tours available"
		/>

		<div
			v-else
			class="grid mt-2.5 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
		>
			<a-card
				v-for="tour in tours.data"
				:key="tour.name"
				hoverable
				:bordered="false"
				class="rounded-none cursor-pointer !shadow-none transition-transform duration-150 hover:scale-[1.01]"
				@click="router.push({ name: 'Tour', params: { name: tour.name } })"
			>
				<template #cover>
					<img
						class="h-64 sm:h-72 md:h-80 w-full object-cover"
						:src="tour.image || '/placeholder.jpg'"
						alt="Tour image"
					/>
				</template>

				<a-card-meta :title="tour.tour_name">
					<template #description>
						<div class="flex flex-wrap gap-1 mt-1">
							<a-tag color="blue">{{ tour.category }}</a-tag>
							<a-tag color="orange">{{ tour.duration }} days</a-tag>
						</div>
					</template>
				</a-card-meta>
			</a-card>
		</div>

		<a-modal
			v-model:open="open"
			title="Create New Tour"
			@ok="handleCreate"
			@cancel="handleCancel"
			:confirm-loading="creating"
			:width="'480px'"
			centered
		>
			<a-form ref="createFormRef" :model="newTour" :rules="formRules" layout="vertical">
				<a-form-item label="Tour Name" name="tour_name">
					<a-input v-model:value="newTour.tour_name" placeholder="Enter tour name" />
				</a-form-item>

				<a-row :gutter="[12, 12]">
					<a-col :span="12">
						<a-form-item label="Duration" name="duration">
							<a-input-number
								class="!w-full"
								v-model:value="newTour.duration"
								:min="1"
								:max="20"
								placeholder="Enter duration"
							/>
						</a-form-item>
					</a-col>

					<a-col :span="12">
						<a-form-item label="Category" name="category">
							<a-select
								v-model:value="newTour.category"
								placeholder="Select category"
							>
								<a-select-option value="Budget">Budget</a-select-option>
								<a-select-option value="Luxury">Luxury</a-select-option>
								<a-select-option value="Comfort">Comfort</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>

			<div class="mt-4">
				<FileUploader
					:fileTypes="['jpg', 'jpeg', 'png']"
					:multiple="false"
					@success="handleFileUpload"
					class="p-0"
				>
					<template #default="{ openFileSelector }">
						<div
							class="rounded overflow-hidden cursor-pointer flex flex-col items-center justify-center"
							@click="openFileSelector"
						>
							<img
								v-if="newTour.image"
								:src="newTour.image"
								alt="avatar"
								class="w-full h-48 object-cover"
							/>
							<div
								v-else
								class="h-48 flex flex-col items-center justify-center text-gray-500 text-sm"
							>
								Upload Tour Image
							</div>
						</div>
					</template>
				</FileUploader>
			</div>
		</a-modal>
	</div>
</template>

<script setup>
import { createListResource, FileUploader } from "frappe-ui";
import { ref, reactive, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const router = useRouter();
const open = ref(false);
const createFormRef = ref();
const creating = ref(false);

const tours = createListResource({
	doctype: "Tour",
	fields: ["name", "tour_name", "duration", "image"],
	auto: false,
});

const newTour = reactive({
	tour_name: "",
	duration: 1,
	category: "",
	image: "",
});

const formRules = {
	tour_name: [{ required: true, message: "Please enter tour name" }],
	duration: [{ required: true, message: "Please enter duration" }],
	category: [{ required: true, message: "Please select category" }],
};

const handleFileUpload = (file) => {
	newTour.image = file.file_url;
};

const handleCreate = async () => {
	try {
		await createFormRef.value.validate();
		creating.value = true;
		await tours.insert.submit({ ...newTour });
		message.success("Tour created successfully", 2);
		newTour.tour_name = "";
		newTour.duration = 1;
		newTour.category = "";
		newTour.image = "";
		open.value = false;
		await nextTick(() => createFormRef.value.resetFields());
		await tours.reload();
	} catch (error) {
		if (error.errorFields) {
			message.error("Please fix the errors below", 2);
		} else {
			message.error("Failed to create tour: " + (error.message || error), 2);
		}
	} finally {
		creating.value = false;
	}
};

const handleCancel = () => {
	newTour.tour_name = "";
	newTour.duration = 1;
	newTour.category = "";
	newTour.image = "";
	open.value = false;
	createFormRef.value.resetFields();
};

onMounted(async () => {
	await tours.fetch();
});
</script>
