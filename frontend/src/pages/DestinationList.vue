<template>
	<div class="min-h-screen bg-gray-50">
		<!-- HEADER -->
		<a-page-header class="!p-0 mb-4 bg-white px-4 py-3 sticky top-0 z-10" title="Destinations">
			<template #extra>
				<a-button type="primary" @click="handleCreate">Create Destination</a-button>
			</template>
		</a-page-header>

		<!-- DESTINATION TABLE -->
		<a-table
			:columns="columns"
			:data-source="destinations.data"
			:loading="destinations.list.loading"
			:pagination="false"
			row-key="name"
			:scroll="{ x: '100%', y: 'calc(100vh - 280px)' }"
			size="middle"
			class="bg-white mx-4"
		>
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'Action'">
					<div class="flex flex-wrap gap-2 justify-center">
						<a-button
							@click="editDestination(record.name)"
							type="text"
							class="!flex justify-center items-center text-blue-500 hover:text-blue-600"
						>
							<FeatherIcon name="edit" class="size-4" />
						</a-button>
						<a-button
							@click="deleteDestination(record.name)"
							type="text"
							danger
							class="!flex justify-center items-center text-red-500 hover:text-red-600"
						>
							<FeatherIcon name="trash-2" class="size-4" />
						</a-button>
					</div>
				</template>
			</template>
		</a-table>

		<!-- DESTINATION MODAL -->
		<a-modal
			v-model:open="open"
			:width="isMobile ? '95%' : '95%'"
			:title="`Destination: ${formModel?.destination_name || ''}`"
			okText="Save"
			@ok="handleSave"
			:confirm-loading="saving"
			@cancel="handleCancel"
			centered
		>
			<div class="flex flex-col lg:flex-row gap-6">
				<!-- LEFT SIDE FORM -->
				<div class="flex-1 space-y-3">
					<a-form
						:form="createFormRef"
						:model="formModel"
						:rules="formRules"
						layout="vertical"
					>
						<a-form-item label="Destination Name" name="destination_name">
							<a-input
								v-model:value="formModel.destination_name"
								placeholder="Enter destination name"
							/>
						</a-form-item>

						<a-form-item label="Description" name="description">
							<a-textarea
								:rows="4"
								v-model:value="formModel.description"
								placeholder="Enter description"
							/>
						</a-form-item>

						<a-form-item label="Image Title" name="image_title">
							<a-input
								v-model:value="formModel.image_title"
								placeholder="Enter image title"
							/>
						</a-form-item>

						<div class="pt-2">
							<a-typography-title :level="5" class="!m-0"
								>Attractions</a-typography-title
							>
						</div>

						<!-- ATTRACTIONS TABLE -->
						<a-table
							:columns="attractionColumns"
							:data-source="filteredAttractions"
							:loading="attractions.list.loading"
							:pagination="false"
							row-key="name"
							size="small"
							class="bg-white"
							:scroll="{ x: '100%' }"
						>
							<template #bodyCell="{ column, record }">
								<template
									v-if="
										['attraction_name', 'type', 'description'].includes(
											column.dataIndex,
										)
									"
								>
									<div>
										<a-input
											v-if="
												editableData[record.name] &&
												column.dataIndex === 'attraction_name'
											"
											v-model:value="
												editableData[record.name][column.dataIndex]
											"
											size="small"
										/>
										<a-select
											v-else-if="
												editableData[record.name] &&
												column.dataIndex === 'type'
											"
											:options="attractionTypes"
											v-model:value="
												editableData[record.name][column.dataIndex]
											"
											size="small"
										/>
										<a-textarea
											v-else-if="
												editableData[record.name] &&
												column.dataIndex === 'description'
											"
											v-model:value="
												editableData[record.name][column.dataIndex]
											"
											size="small"
											:rows="1"
										/>
										<template v-else>{{ record[column.dataIndex] }}</template>
									</div>
								</template>

								<template v-if="column.key === 'Action'">
									<div class="flex gap-1">
										<template v-if="editableData[record.name]">
											<a-typography-link
												@click="saveAttraction(record.name)"
												class="text-blue-500"
												>Save</a-typography-link
											>
											<a-typography-link
												@click="cancelEdit(record.name)"
												class="text-gray-500"
												>Cancel</a-typography-link
											>
										</template>
										<template v-else>
											<a-button
												@click="editAttraction(record.name)"
												type="text"
												class="text-blue-500 hover:text-blue-600"
											>
												<FeatherIcon name="edit" class="size-4" />
											</a-button>
											<a-button
												@click="deleteAttraction(record.name)"
												type="text"
												danger
												class="text-red-500 hover:text-red-600"
											>
												<FeatherIcon name="trash-2" class="size-4" />
											</a-button>
										</template>
									</div>
								</template>
							</template>
						</a-table>

						<a-button
							type="dashed"
							class="mt-3 w-full text-gray-600 hover:text-blue-500"
							@click="handleAddAttraction"
						>
							+ Add Attraction
						</a-button>
					</a-form>
				</div>

				<!-- RIGHT SIDE IMAGE UPLOAD -->
				<div class="lg:w-[40%] flex flex-col">
					<FileUploader
						:fileTypes="['jpg', 'jpeg', 'png']"
						:multiple="false"
						@success="handleFileUpload"
						class="border-none"
					>
						<template #default="{ openFileSelector }">
							<div
								class="rounded-lg overflow-hidden cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
								@click="openFileSelector"
							>
								<img
									v-if="formModel?.image"
									:src="formModel.image"
									alt="preview"
									class="w-full h-64 object-cover"
								/>
								<div
									v-else
									class="h-64 flex items-center justify-center text-gray-500 text-sm"
								>
									Upload Destination Image
								</div>
							</div>
						</template>
					</FileUploader>
				</div>
			</div>

			<!-- ATTRACTION MODAL -->
			<a-modal
				v-model:open="attractionOpen"
				title="Add Attraction"
				@ok="handleSaveAttraction"
				:confirm-loading="attractionSaving"
				@cancel="handleCancelAttraction"
				:width="isMobile ? '95%' : '420px'"
				centered
			>
				<a-form
					:form="attractionFormRef"
					:model="newAttractionForm"
					:rules="attractionFormRules"
					layout="vertical"
				>
					<a-form-item label="Attraction Name" name="attraction_name">
						<a-input
							v-model:value="newAttractionForm.attraction_name"
							placeholder="Enter attraction name"
						/>
					</a-form-item>

					<a-form-item label="Type" name="type">
						<a-select
							v-model:value="newAttractionForm.type"
							:options="attractionTypes"
							placeholder="Select type"
						/>
					</a-form-item>

					<a-form-item label="Description" name="description">
						<a-textarea
							v-model:value="newAttractionForm.description"
							placeholder="Description"
							:rows="3"
						/>
					</a-form-item>
				</a-form>
			</a-modal>
		</a-modal>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from "vue";
import { message } from "ant-design-vue";
import { DestinationStore } from "@/data/destinations";
import { AttractionsStore } from "@/data/Attraction";
import { createDocumentResource, FileUploader } from "frappe-ui";
import { cloneDeep } from "lodash-es";

const { destinations } = DestinationStore();
const { attractions } = AttractionsStore();
const attractionTypes = [
	{
		value: "Monastery",
	},
	{
		value: "Museum",
	},
	{
		value: "Photo Site",
	},
	{
		value: "Monument",
	},
];
const open = ref(false);
const imageOpen = ref(false);
const attractionOpen = ref(false);
const saving = ref(false);
const attractionSaving = ref(false);
const isCreate = ref(false);
const destinationName = ref("");
const editableData = reactive({});

const destination = createDocumentResource({
	doctype: "Destination",
	name: destinationName,
	auto: false,
});

const createFormRef = ref(null);
const imageFormRef = ref(null);
const attractionFormRef = ref(null);
const formModel = ref(null);

const newImageForm = reactive({ title: "", image: "" });

const newAttractionForm = reactive({ attraction_name: "", type: "" });

const formRules = {
	destination_name: [{ required: true, message: "Please enter destination name" }],
};
const imageFormRules = {
	title: [{ required: true, message: "Please enter image title" }],
};
const attractionFormRules = {
	attraction_name: [{ required: true, message: "Please enter attraction name" }],
	type: [{ required: true, message: "Please select type" }],
};

// Filtered attractions computed
const filteredAttractions = computed(() => {
	const currentDestName = formModel.value?.name || "";
	return attractions.data.filter((attr) => attr.destination === currentDestName);
});

// TABLE COLUMNS
const columns = [
	{ title: "Destination Name", key: "destination_name", dataIndex: "destination_name" },
	{ title: "Action", key: "Action", width: "15%" },
];

const attractionColumns = [
	{ title: "Attraction Name", dataIndex: "attraction_name", width: "30%" },
	{ title: "Type", dataIndex: "type" },
	{ title: "Description", dataIndex: "description" },
	{ title: "Action", key: "Action" },
];

// DESTINATION CRUD
const handleCreate = async () => {
	isCreate.value = true;
	formModel.value = reactive({ destination_name: "", description: "", images: [] });
	open.value = true;
};

const editDestination = async (name) => {
	try {
		isCreate.value = false;
		destinationName.value = name;
		destination.name = name;
		await destination.reload();
		formModel.value = destination.doc;
		open.value = true;
	} catch (error) {
		message.error(error.message);
	}
};

const deleteDestination = async (name) => {
	try {
		await destinations.delete.submit(name);
		await destinations.reload();
		message.success("Destination deleted successfully");
	} catch (error) {
		message.error("Failed to delete destination");
	}
};

const handleSave = async () => {
	try {
		saving.value = true;
		if (isCreate.value) {
			await destinations.insert.submit({ ...formModel.value });
			message.success("Destination created successfully");
		} else {
			await destination.save.submit();
			message.success("Destination updated successfully");
		}
		await destinations.reload();
		open.value = false;
	} catch (error) {
		message.error(error.message || "Failed to save");
	} finally {
		saving.value = false;
	}
};

const handleCancel = () => {
	open.value = false;
};

// ATTRACTION CRUD
const handleAddAttraction = () => {
	newAttractionForm.attraction_name = "";
	newAttractionForm.type = "";
	newAttractionForm.destination = formModel.value?.name || "";
	attractionOpen.value = true;
};

const handleSaveAttraction = async () => {
	try {
		attractionSaving.value = true;
		await attractions.insert.submit({ ...newAttractionForm });
		message.success("Attraction created successfully");
		await attractions.reload();
		attractionOpen.value = false;
	} catch (error) {
		if (error.errorFields) {
			message.error("Please fix the errors below");
		} else {
			message.error("Failed to create attraction");
			console.error("Create error:", error);
		}
	} finally {
		attractionSaving.value = false;
	}
};

const handleCancelAttraction = () => {
	attractionOpen.value = false;
};

// ATTRACTION EDIT TABLE LOGIC
const editAttraction = (name) => {
	const item = filteredAttractions.value.find((a) => a.name === name);
	if (item) editableData[name] = cloneDeep(item);
};

const saveAttraction = async (name) => {
	try {
		await attractions.setValue.submit(editableData[name]);
		message.success("Attraction updated");
		delete editableData[name];
		await attractions.reload();
	} catch (e) {
		message.error("Failed to update");
	}
};

const cancelEdit = (name) => delete editableData[name];

const deleteAttraction = async (name) => {
	try {
		await attractions.delete.submit(name);
		await attractions.reload();
		message.success("Attraction deleted");
	} catch (error) {
		message.error("Failed to delete attraction");
	}
};

// IMAGE HANDLERS
const handleFileUpload = (file) => (formModel.value.image = file.file_url);
// const handleImage = () => {
//     formModel.value.images.push({ title: newImageForm.title, image: newImageForm.image })
//     Object.assign(newImageForm, { title: '', image: '' })
//     imageOpen.value = false
//     message.success('Image added')
// }
</script>
