<template>
	<a-page-header class="!p-0 !mb-2" title="Guide" @back="() => $router.go(-1)">
		<template #extra>
			<a-button type="primary" @click="open = true">Create guide</a-button>
		</template>
	</a-page-header>

	<!-- Empty -->
	<a-empty
		v-if="!guides.data || guides.data.length === 0"
		class="w-full mt-10"
		description="No guides available"
	/>

	<!-- Grid -->
	<div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
		<a-card
			v-for="guide in guides.data"
			:key="guide.name"
			hoverable
			class="!border-none !shadow-none cursor-pointer transition-all duration-150"
			@click="router.push({ name: 'Employee', params: { name: guide.name } })"
		>
			<template #cover>
				<img
					class="h-64 sm:h-72 md:h-80 w-full object-cover"
					alt="Guide image"
					:src="guide.image || '/placeholder.jpg'"
				/>
			</template>

			<a-card-meta :title="`${guide.last_name} ${guide.first_name}`">
				<template #description>
					<div class="flex flex-col gap-1 text-gray-800">
						<div class="flex items-center gap-2">
							<FeatherIcon name="mail" class="size-4 text-gray-500" />
							<span class="truncate">{{ guide.email }}</span>
						</div>
						<div class="flex items-center gap-2">
							<FeatherIcon name="phone" class="size-4 text-gray-500" />
							<span>{{ guide?.phone_number || "—" }}</span>
						</div>
					</div>
				</template>
			</a-card-meta>
		</a-card>
	</div>

	<!-- Modal -->
	<a-modal
		v-model:open="open"
		title="Create New Guide"
		@ok="handleCreate"
		@cancel="handleCancel"
		:confirm-loading="creating"
		:width="isMobile ? '95%' : '480px'"
		centered
	>
		<a-form ref="createFormRef" :model="newGuide" :rules="formRules" layout="vertical">
			<a-form-item label="First Name" name="first_name">
				<a-input v-model:value="newGuide.first_name" placeholder="Enter first name" />
			</a-form-item>

			<a-form-item label="Last Name" name="last_name">
				<a-input v-model:value="newGuide.last_name" placeholder="Enter last name" />
			</a-form-item>

			<a-form-item label="Email" name="email">
				<a-input v-model:value="newGuide.email" placeholder="Enter email" type="email" />
			</a-form-item>

			<a-form-item label="Phone Number" name="phone_number">
				<a-input v-model:value="newGuide.phone_number" placeholder="Enter phone number" />
			</a-form-item>
		</a-form>

		<FileUploader
			:fileTypes="['jpg', 'jpeg', 'png']"
			:multiple="false"
			@success="handleFileUpload"
			class="border-none p-0"
		>
			<template #default="{ openFileSelector }">
				<div
					class="rounded overflow-hidden cursor-pointer flex items-center justify-center"
					@click="openFileSelector"
				>
					<img
						v-if="newGuide.image"
						:src="newGuide.image"
						alt="avatar"
						class="w-full h-56 object-cover"
					/>
					<div
						v-else
						class="h-56 flex items-center justify-center text-gray-500 text-sm"
					>
						Upload Image
					</div>
				</div>
			</template>
		</FileUploader>
	</a-modal>
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

const guides = createListResource({
	doctype: "Guide",
	fields: ["name", "first_name", "last_name", "image", "email", "phone_number"],
	auto: true,
	orderBy: "creation desc",
	pageLength: 20,
	cache: "Guides",
});

const newGuide = reactive({
	first_name: "",
	last_name: "",
	email: "",
	phone_number: "",
	image: "",
});

const formRules = {
	first_name: [{ required: true, message: "Please enter first name" }],
	last_name: [{ required: true, message: "Please enter last name" }],
	email: [{ required: true, message: "Please enter email", type: "email" }],
	phone_number: [{ required: true, message: "Please enter phone number" }],
};

const handleFileUpload = (file) => {
	newGuide.image = file.file_url;
};

const handleCreate = async () => {
	try {
		await createFormRef.value.validate();
		creating.value = true;
		await guides.insert.submit({ ...newGuide });
		message.success("Guide created successfully", 2);
		newGuide.first_name = "";
		newGuide.last_name = "";
		newGuide.email = "";
		newGuide.phone_number = "";
		newGuide.image = "";
		open.value = false;
		await nextTick(() => createFormRef.value.resetFields());
		await guides.reload();
	} catch (error) {
		if (error.errorFields) {
			message.error("Please fix the errors below", 2);
		} else {
			message.error("Failed to create guide: " + (error.message || error), 2);
		}
	} finally {
		creating.value = false;
	}
};

const handleCancel = () => {
	newGuide.first_name = "";
	newGuide.last_name = "";
	newGuide.email = "";
	newGuide.phone_number = "";
	newGuide.image = "";
	open.value = false;
	createFormRef.value.resetFields();
};
</script>
