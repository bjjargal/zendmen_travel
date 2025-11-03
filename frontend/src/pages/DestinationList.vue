<template>
	<div class="min-h-screen bg-gray-50">
		<!-- HEADER -->
		<a-page-header class="!p-0 mb-2 bg-white px-4 py-3 sticky top-0 z-10" title="Destinations">
			<template #extra>
				<a-button type="primary" @click="createOpen = true">Create Destination</a-button>
			</template>
		</a-page-header>

		<div class="overflow-x-auto">
			<a-table :columns="columns" :data-source="destinations.data" :loading="destinations.list.loading"
				:pagination="false" row-key="name" size="middle" :scroll="{ x: 800, y: 'calc(100vh - 280px)' }"
				class="bg-white mx-2 sm:mx-4">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'Action'">
						<div class="flex justify-center items-center gap-2">
							<a-button @click="editDestination(record.name)" type="text"
								class="!flex justify-center items-center text-blue-500 hover:text-blue-600 !p-0">
								<FeatherIcon name="edit" class="w-4 h-4" />
							</a-button>

							<a-button @click="deleteDestination(record.name)" type="text" danger
								class="!flex justify-center items-center text-red-500 hover:text-red-600 !p-0">
								<FeatherIcon name="trash-2" class="w-4 h-4" />
							</a-button>
						</div>
					</template>
				</template>
			</a-table>
		</div>

		<!-- CREATE DESTINATION MODAL -->
		<a-modal v-model:open="createOpen" title="New Destination" okText="Create" @ok="handleCreateSave"
			:confirm-loading="saving" @cancel="handleCancelCreate" centered>
			<div class="flex flex-col lg:flex-row gap-6">
				<!-- LEFT SIDE FORM -->
				<div class="flex-1 space-y-3">
					<a-form :model="createFormModel" layout="vertical">
						<a-form-item label="Destination Name" name="destination_name">
							<a-input v-model:value="createFormModel.destination_name"
								placeholder="Enter destination name" />
						</a-form-item>

						<a-form-item label="Description" name="description">
							<a-textarea :rows="4" v-model:value="createFormModel.description"
								placeholder="Enter description" />
						</a-form-item>

						<a-form-item label="Image Title" name="image_title">
							<a-input v-model:value="createFormModel.image_title" placeholder="Enter image title" />
						</a-form-item>
					</a-form>
					<div class=" flex flex-col">
						<FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false"
							@success="handleCreateFileUpload" class="border-none">
							<template #default="{ openFileSelector }">
								<div class="rounded-lg overflow-hidden cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
									@click="openFileSelector">
									<img v-if="createFormModel?.image" :src="createFormModel.image" alt="preview"
										class="w-full h-64 object-cover" />
									<div v-else class="h-64 flex items-center justify-center text-gray-500 text-sm">
										Upload Destination Image
									</div>
								</div>
							</template>
						</FileUploader>
					</div>
				</div>

				<!-- RIGHT SIDE IMAGE UPLOAD -->

			</div>
		</a-modal>

		<!-- EDIT DESTINATION MODAL -->
		<a-modal v-model:open="editOpen" :width="'95%'"
			:title="`Edit Destination: ${destination.doc?.destination_name || ''}`" okText="Save" @ok="handleEditSave"
			:confirm-loading="saving" @cancel="handleCancelEdit" centered>
			<div class="flex flex-col lg:flex-row gap-6">
				<!-- LEFT SIDE FORM -->
				<div class="flex-1 space-y-3">
					<a-form :model="destination.doc" layout="vertical">
						<a-form-item label="Destination Name" name="destination_name">
							<a-input v-model:value="destination.doc.destination_name"
								placeholder="Enter destination name" />
						</a-form-item>

						<a-form-item label="Description" name="description">
							<a-textarea :rows="4" v-model:value="destination.doc.description"
								placeholder="Enter description" />
						</a-form-item>

						<a-form-item label="Image Title" name="image_title">
							<a-input v-model:value="destination.doc.image_title" placeholder="Enter image title" />
						</a-form-item>

						<div class="pt-2">
							<a-typography-title :level="5" class="!m-0">Attractions</a-typography-title>
						</div>

						<!-- ATTRACTIONS TABLE -->
						<a-table :columns="attractionColumns" :data-source="filteredAttractions"
							:loading="attractions.list.loading" :pagination="false" row-key="name" size="small"
							class="bg-white" :scroll="{ x: '100%' }">
							<template #bodyCell="{ column, record }">
								<template v-if="
									['attraction_name', 'type', 'description', 'cost'].includes(
										column.dataIndex,
									)
								">
									<div>
										<a-input v-if="
											editableData[record.name] &&
											column.dataIndex === 'attraction_name'
										" v-model:value="editableData[record.name][column.dataIndex]" size='small' />
										<a-input-number
											v-else-if="editableData[record.name] && column.dataIndex === 'cost'"
											v-model:value="editableData[record.name][column.dataIndex]"
											style="width: 100%;" />
										<a-select v-else-if="
											editableData[record.name] &&
											column.dataIndex === 'type'
										" :options="attractionTypes" v-model:value="editableData[record.name][column.dataIndex]
											" size="small" />
										<a-textarea v-else-if="
											editableData[record.name] &&
											column.dataIndex === 'description'
										" v-model:value="editableData[record.name][column.dataIndex]
											" size="small" :rows="1" />
										<template v-else>{{ record[column.dataIndex] }}</template>
									</div>
								</template>

								<template v-if="column.key === 'Action'">
									<div class="flex gap-1">
										<template v-if="editableData[record.name]">
											<a-typography-link @click="saveAttraction(record.name)"
												class="text-blue-500">Save</a-typography-link>
											<a-typography-link @click="cancelEdit(record.name)"
												class="text-gray-500">Cancel</a-typography-link>
										</template>
										<template v-else>
											<a-button @click="editAttraction(record.name)" type="text"
												class="text-blue-500 hover:text-blue-600">
												<FeatherIcon name="edit" class="size-4" />
											</a-button>
											<a-button @click="deleteAttraction(record.name)" type="text" danger
												class="text-red-500 hover:text-red-600">
												<FeatherIcon name="trash-2" class="size-4" />
											</a-button>
										</template>
									</div>
								</template>
							</template>
						</a-table>

						<a-button type="dashed" class="mt-3 w-full text-gray-600 hover:text-blue-500"
							@click="handleAddAttraction">
							+ Add Attraction
						</a-button>
					</a-form>
				</div>

				<!-- RIGHT SIDE IMAGE UPLOAD -->
				<div class="lg:w-[40%] flex flex-col">
					<FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false" @success="handleEditFileUpload"
						class="border-none">
						<template #default="{ openFileSelector }">
							<div class="rounded-lg overflow-hidden cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
								@click="openFileSelector">
								<img v-if="destination.doc?.image" :src="destination.doc.image" alt="preview"
									class="w-full h-64 object-cover" />
								<div v-else class="h-64 flex items-center justify-center text-gray-500 text-sm">
									Upload Destination Image
								</div>
							</div>
						</template>
					</FileUploader>
				</div>
			</div>

			<!-- ATTRACTION MODAL -->
			<a-modal v-model:open="attractionOpen" title="Add Attraction" @ok="handleSaveAttraction"
				:confirm-loading="attractionSaving" @cancel="handleCancelAttraction" :width="'420px'" centered>
				<a-form :model="newAttractionForm" layout="vertical">
					<a-form-item label="Attraction Name" name="attraction_name">
						<a-input v-model:value="newAttractionForm.attraction_name"
							placeholder="Enter attraction name" />
					</a-form-item>

					<a-form-item label="Cost" name="cost">
						<a-input-number v-model:value="newAttractionForm.cost" style="width: 100%;" />
					</a-form-item>
					<a-form-item label="Type" name="type">
						<a-select v-model:value="newAttractionForm.type" :options="attractionTypes"
							placeholder="Select type" />
					</a-form-item>

					<a-form-item label="Description" name="description">
						<a-textarea v-model:value="newAttractionForm.description" placeholder="Description" :rows="3" />
					</a-form-item>
				</a-form>
			</a-modal>
		</a-modal>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
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
const createOpen = ref(false);
const editOpen = ref(false);
const attractionOpen = ref(false);
const saving = ref(false);
const attractionSaving = ref(false);
const destinationName = ref("");
const editableData = reactive({});

const destination = createDocumentResource({
	doctype: "Destination",
	name: destinationName,
	auto: false,
});

const createFormModel = reactive({
	destination_name: "",
	description: "",
	image_title: "",
	image: ""
});

const newAttractionForm = reactive({
	attraction_name: "",
	cost: 0,
	type: "",
	description: "",
	destination: ""
});

// Filtered attractions computed
const filteredAttractions = computed(() => {
	const currentDestName = destination.doc?.name || "";
	return attractions.data.filter((attr) => attr.destination === currentDestName);
});

// TABLE COLUMNS
const columns = [
	{ title: "Destination Name", key: "destination_name", dataIndex: "destination_name" },
	{ title: "Description", key: "description", dataIndex: "description" },
	{ title: "Action", key: "Action", width: "15%" },
];

const attractionColumns = [
	{ title: "Attraction Name", dataIndex: "attraction_name", width: "30%" },
	{ title: "Type", dataIndex: "type" },
	{ title: "Description", dataIndex: "description" },
	{ title: "Cost", dataIndex: "cost" },
	{ title: "Action", key: "Action" },
];

// CREATE DESTINATION
const handleCreateSave = async () => {
	try {
		saving.value = true;
		await destinations.insert.submit({ ...createFormModel });
		message.success("Destination created successfully");
		await destinations.reload();
		createOpen.value = false;
	} catch (error) {
		message.error(error.message || "Failed to create destination");
	} finally {
		saving.value = false;
	}
};

const handleCancelCreate = () => {
	createOpen.value = false;
	Object.assign(createFormModel, {
		destination_name: "",
		description: "",
		image_title: "",
		image: ""
	});
};

// EDIT DESTINATION
const editDestination = async (name) => {
	try {
		destinationName.value = name;
		destination.name = name;
		await destination.reload();
		editOpen.value = true;
	} catch (error) {
		message.error(error.message);
	}
};

const handleEditSave = async () => {
	try {
		saving.value = true;
		await destination.save.submit();
		message.success("Destination updated successfully");
		await destinations.reload();
		editOpen.value = false;
	} catch (error) {
		message.error(error.message || "Failed to save");
	} finally {
		saving.value = false;
	}
};

const handleCancelEdit = () => {
	editOpen.value = false;
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

// IMAGE HANDLERS
const handleCreateFileUpload = (file) => {
	createFormModel.image = file.file_url;
};

const handleEditFileUpload = (file) => {
	destination.doc.image = file.file_url;
};

// ATTRACTION CRUD
const handleAddAttraction = () => {
	newAttractionForm.attraction_name = "";
	newAttractionForm.cost = 0;
	newAttractionForm.type = "";
	newAttractionForm.description = "";
	newAttractionForm.destination = destination.doc?.name || "";
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
		message.error(error.message || "Failed to create attraction");
	} finally {
		attractionSaving.value = false;
	}
};

const handleCancelAttraction = () => {
	attractionOpen.value = false;
	Object.assign(newAttractionForm, {
		attraction_name: "",
		cost: 0,
		type: "",
		description: "",
		destination: ""
	});
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
</script>