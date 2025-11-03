<template>
	<a-page-header class="!p-0 !mb-2" title="Guide" @back="() => $router.go(-1)">
		<template #extra>
			<a-button type="primary" @click="open = true">Create staff</a-button>
		</template>
	</a-page-header>
	<a-empty v-if="staffs?.data?.length === 0" class="w-full mt-10" description="No staff available" />
	<div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
		<a-card v-for="staff in staffs.data" :key="staff.name" hoverable @click="openStuff(staff.name)"
			class="!border-none !shadow-none cursor-pointer transition-all duration-150">
			<template #cover>
				<img class="h-64 sm:h-72 md:h-80 w-full object-cover" alt="Guide image"
					:src="staff.image || '/placeholder.jpg'" />
			</template>
			<a-card-meta :title="`${staff.full_name}`">
				<template #description>
					<div class="flex flex-col gap-1 text-gray-800">
						<div class="flex items-center gap-2">
							<FeatherIcon name="mail" class="size-4 text-gray-500" />
							<span class="truncate">{{ staff.email }}</span>
						</div>
						<div class="flex items-center gap-2">
							<FeatherIcon name="phone" class="size-4 text-gray-500" />
							<span>{{ staff?.phone_number || "—" }}</span>
						</div>
					</div>
				</template>
			</a-card-meta>
		</a-card>
	</div>
	<a-modal v-model:open="staffOpen" title="Create New Guide" @ok="handleSave" :width="'480px'" centered>
		<a-form ref="createFormRef" :model="staff.doc" :rules="formRules" layout="vertical">
			<a-form-item label="Full Name" name="full_name">
				<a-input v-model:value="staff.doc.full_name" placeholder="Enter first name" />
			</a-form-item>
			<a-form-item label="Type" name="type">
				<a-select v-model:value="staff.doc.type" :options="staffType" placeholder="select type" />
			</a-form-item>
			<a-form-item label="Price" name="price">
				<a-input-number v-model:value="staff.doc.price" :formatter="numberFormatter" :parser="numberParser"
					addon-after="₮" class="!w-full" />
			</a-form-item>
			<a-form-item label="Email" name="email">
				<a-input v-model:value="staff.doc.email" placeholder="Enter email" type="email" />
			</a-form-item>
			<a-form-item label="Phone Number" name="phone_number">
				<a-input v-model:value="staff.doc.phone_number" placeholder="Enter phone number" />
			</a-form-item>
		</a-form>

		<FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false" @success="handleFileUpload"
			class="border-none p-0">
			<template #default="{ openFileSelector }">
				<div class="rounded overflow-hidden cursor-pointer flex items-center justify-center"
					@click="openFileSelector">
					<img v-if="staff.doc.image" :src="staff.doc.image" alt="avatar" class="w-full h-56 object-cover" />
					<div v-else class="h-56 flex items-center justify-center text-gray-500 text-sm">
						Upload Image
					</div>
				</div>
			</template>
		</FileUploader>
	</a-modal>
	<a-modal v-model:open="open" title="Create New Guide" @ok="handleCreate" :confirm-loading="creating"
		:width="'480px'" centered>
		<a-form ref="createFormRef" :model="newStaff" :rules="formRules" layout="vertical">
			<a-form-item label="Full Name" name="full_name">
				<a-input v-model:value="newStaff.full_name" placeholder="Enter first name" />
			</a-form-item>
			<a-form-item label="Type" name="type">
				<a-select v-model:value="newStaff.type" :options="staffType" placeholder="select type" />
			</a-form-item>
			<a-form-item label="Price" name="price">
				<a-input-number v-model:value="newStaff.price" :formatter="numberFormatter" :parser="numberParser"
					addon-after="₮" class="!w-full" />
			</a-form-item>
			<a-form-item label="Email" name="email">
				<a-input v-model:value="newStaff.email" placeholder="Enter email" type="email" />
			</a-form-item>
			<a-form-item label="Phone Number" name="phone_number">
				<a-input v-model:value="newStaff.phone_number" placeholder="Enter phone number" />
			</a-form-item>
		</a-form>

		<FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false" @success="handleFileUpload"
			class="border-none p-0">
			<template #default="{ openFileSelector }">
				<div class="rounded overflow-hidden cursor-pointer flex items-center justify-center"
					@click="openFileSelector">
					<img v-if="newStaff.image" :src="newStaff.image" alt="avatar" class="w-full h-56 object-cover" />
					<div v-else class="h-56 flex items-center justify-center text-gray-500 text-sm">
						Upload Image
					</div>
				</div>
			</template>
		</FileUploader>
	</a-modal>
</template>

<script setup>
import { createDocumentResource, FileUploader } from "frappe-ui";
import { ref, reactive, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { staffStore } from "@/data/Staff";

const router = useRouter();
const open = ref(false);
const createFormRef = ref();
const creating = ref(false);

const { staffs } = staffStore()

const newStaff = reactive({
	full_name: "",
	type: "",
	price: 0,
	email: "",
	phone_number: "",
	image: "",
});

const staffName = ref("")
const staff = createDocumentResource({
	doctype: "Staff",
	name: staffName,
	auto: false,
})
const staffOpen = ref(false)

const staffType = [
	{
		value: 'Experienced guide'
	},
	{
		value: 'Standard guide'
	},
	{
		value: 'Big group guide'
	},
	{
		value: 'Experienced cook'
	},
	{
		value: 'Standard cook'
	},
	{
		value: 'Big group cook'
	},

]

const formRules = {
	full_name: [{ required: true, message: "Please enter full name" }],
	type: [{ required: true, message: "Please enter type" }],
	price: [{ required: true, message: "Please enter price" }],


};

const handleFileUpload = (file) => {
	newStaff.image = file.file_url;
};

const handleCreate = async () => {
	try {
		await createFormRef.value.validate();
		creating.value = true;
		await staffs.insert.submit({ ...newStaff });
		message.success("Guide created successfully", 2);
		newStaff.full_name = "";
		newStaff.type = "";
		newStaff.email = "";
		newStaff.phone_number = "";
		newStaff.image = "";
		open.value = false;
		await nextTick(() => createFormRef.value.resetFields());
		await staffs.reload();
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

const openStuff = async (name) => {
	try {
		staffName.value = name
		staff.name = name
		await staff.reload();
		staffOpen.value = true
	}
	catch (error) {
		message.error(error.message);
	}

}
const handleSave = async () => {
	try {
		await createFormRef.value.validate();
		await staff.save.submit();
		message.success("Staff updated successfully");
		staffOpen.value = false;
	} catch (error) {
		message.error(error.message || "Failed to save");
	}
};
const numberFormatter = (value) => {
	if (value === undefined || value === null) return '';
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const numberParser = (value) => {
	if (!value) return '';
	return value.replace(/,/g, '');
}


</script>
