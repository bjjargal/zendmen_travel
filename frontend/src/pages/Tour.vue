<template>
	<div class="min-h-screen">
		<a-page-header
			class="!p-0 mb-3 px-4 py-2 sticky top-0 z-10"
			:title="tour?.doc?.tour_name || 'Tour'"
			@back="() => $router.go(-1)"
		>
			<template #extra>
				<a-space>
					<a-button @click="duplicateDoc" :loading="duplicateLoading" type="default"
						>Duplicate</a-button
					>
					<a-button @click="pdfOpen = true" type="dashed">Show PDF</a-button>
					<a-button @click="saveDoc" :loading="!!tour?.save?.loading" type="primary"
						>Save</a-button
					>
				</a-space>
			</template>
		</a-page-header>

		<a-spin v-if="tour.get.loading" tip="Loading..." class="block mt-20" />

		<div v-else class="flex flex-col lg:flex-row h-full">
			<div class="w-full lg:w-[28%] p-4 flex flex-col gap-2">
				<FileUploader
					:fileTypes="['jpg', 'jpeg', 'png']"
					:multiple="false"
					@success="handleFileUpload"
					class="border-none"
				>
					<template #default="{ openFileSelector }">
						<div
							class="rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
							@click="openFileSelector"
						>
							<img
								v-if="tour.doc.image"
								:src="tour.doc.image"
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

				<a-form layout="vertical" class="w-full space-y-1">
					<a-form-item label="Tour Name">
						<a-input
							v-model:value="tour.doc.tour_name"
							placeholder="Enter tour name"
						/>
					</a-form-item>

					<a-form-item label="Subtitle">
						<a-textarea v-model:value="tour.doc.sub_title" :rows="4" />
					</a-form-item>

					<div class="grid grid-cols-2 gap-2">
						<a-form-item label="Duration">
							<a-input-number
								v-model:value="tour.doc.duration"
								:min="1"
								:max="30"
								class="!w-full"
								addon-after="Days"
							/>
						</a-form-item>
						<a-form-item label="Difficulty">
							<a-select
								v-model:value="tour.doc.difficulty"
								:options="difficultyOptions"
								allow-clear
							/>
						</a-form-item>
					</div>

					<a-form-item label="Group Size">
						<a-space>
							<a-input-number
								v-model:value="tour.doc.min_people"
								:min="1"
								:max="20"
								placeholder="min"
							/>
							<a-input-number
								v-model:value="tour.doc.max_people"
								:min="1"
								:max="20"
								placeholder="max"
							/>
						</a-space>
					</a-form-item>

					<a-form-item label="Total Distance">
						<a-input-number
							v-model:value="tour.doc.total_distance"
							addon-after="km"
							class="!w-full"
						/>
					</a-form-item>
				</a-form>
			</div>

			<div class="flex-1 p-4 overflow-x-hidden overflow-y-auto">
				<a-tabs v-model:activeKey="current" tab-position="top" type="card">
					<a-tab-pane v-for="day in tour.doc.duration" :key="day" :tab="`Day ${day}`">
						<div class="flex flex-col gap-4">
							<div
								v-for="(a, idx) in tour.doc.accomodation.filter(
									(acc) => acc.day === day,
								)"
								:key="idx"
								class="p-3 rounded-md"
							>
								<FileUploader
									:fileTypes="['jpg', 'jpeg', 'png']"
									:multiple="false"
									@success="(file) => (a.image = file.file_url)"
								>
									<template #default="{ openFileSelector }">
										<div
											class="rounded-md overflow-hidden cursor-pointer flex items-center justify-center"
											@click="openFileSelector"
										>
											<img
												v-if="a.image"
												:src="a.image"
												alt="avatar"
												class="w-full h-60 object-cover"
											/>
											<div
												v-else
												class="h-48 flex items-center justify-center text-gray-500"
											>
												Upload Day Image
											</div>
										</div>
									</template>
								</FileUploader>

								<a-form-item label="Image Description" class="mt-2">
									<a-input
										v-model:value="a.image_title"
										allow-clear
										placeholder="Enter image description"
									/>
								</a-form-item>
							</div>

							<a-form
								v-for="(a, idx) in tour.doc.accomodation.filter(
									(acc) => acc.day === day,
								)"
								:key="`form-${idx}`"
								layout="vertical"
								class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
							>
								<a-form-item label="Title">
									<a-input v-model:value="a.title" placeholder="Title" />
								</a-form-item>

								<a-form-item label="Destination">
									<a-select
										v-model:value="a.destination"
										:options="destinationOptions"
										allow-clear
										placeholder="Select destination"
									/>
								</a-form-item>

								<a-form-item label="Difficulty">
									<a-select
										v-model:value="a.difficulty"
										:options="difficultyOptions"
										allow-clear
									/>
								</a-form-item>

								<a-form-item label="Accomodation">
									<a-select
										v-model:value="a.accomodation"
										:options="accomodationOptions"
										allow-clear
									/>
								</a-form-item>

								<a-form-item label="Distance">
									<a-input-number
										v-model:value="a.distance"
										addon-after="km"
										class="!w-full"
									/>
								</a-form-item>

								<a-form-item label="Drive Time">
									<a-input-number
										v-model:value="a.drive_time"
										addon-after="hrs"
										class="!w-full"
									/>
								</a-form-item>

								<a-form-item label="Terrain">
									<a-select
										v-model:value="a.terrain"
										:options="terrainOptions"
										allow-clear
									/>
								</a-form-item>

								<a-form-item label="Altitude">
									<a-input-number
										v-model:value="a.altitude"
										addon-after="m"
										class="!w-full"
									/>
								</a-form-item>

								<a-form-item label="Meals">
									<a-space direction="vertical">
										<a-checkbox v-model:checked="a.breakfast"
											>Breakfast</a-checkbox
										>
										<a-checkbox v-model:checked="a.lunch">Lunch</a-checkbox>
										<a-checkbox v-model:checked="a.dinner">Dinner</a-checkbox>
									</a-space>
								</a-form-item>

								<a-form-item label="Activities">
									<a-checkbox-group
										v-model:value="dayActivity"
										:options="getActivityOptions(a.destination)"
									/>
								</a-form-item>

								<a-form-item label="Attractions">
									<a-checkbox-group
										v-model:value="dayAttraction"
										:options="getAttractionOptions(a.destination)"
									/>
								</a-form-item>
							</a-form>

							<!-- NOTES -->
							<a-table
								:columns="noteColumns"
								:pagination="false"
								:data-source="notes"
								size="small"
								class="mt-3"
							>
								<template #bodyCell="{ column, record }">
									<template v-if="column.dataIndex === 'note'">
										<a-textarea
											:rows="1"
											v-model:value="record.note"
											placeholder="Write note"
										/>
									</template>
									<template v-else>
										<a-button danger size="small" @click="deleteNote(record)"
											>Delete</a-button
										>
									</template>
								</template>
							</a-table>

							<a-button class="mt-2" @click="addNote" type="dashed"
								>+ Add Note</a-button
							>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>

		<a-modal
			v-model:open="pdfOpen"
			title="Preview PDF"
			:width="isMobile ? '100%' : '80%'"
			centered
			destroy-on-close
			:bodyStyle="{
				padding: isMobile ? '0.5rem' : '1rem',
				maxHeight: '80vh',
				overflowY: 'scroll',
				scrollbarWidth: 'none',
			}"
			@ok="downloadPDF"
		>
			<div ref="pdfContent" class="w-full no-scrollbar">
				<tourPDF :tour="tour" />
			</div>
		</a-modal>
	</div>
</template>

<script setup>
import { createDocumentResource, createResource, FileUploader } from "frappe-ui";
import { ref, computed, watch, nextTick, defineComponent } from "vue";
import { DestinationStore } from "@/data/destinations";
import { ActivityStore } from "@/data/Activities";
import { message } from "ant-design-vue";
import { ActivityDesStore } from "@/data/ActivityDestination";
import { AttractionsStore } from "../data/Attraction";
import { useRouter } from "vue-router";
import tourPDF from "../components/tourPDF.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
});

const router = useRouter();
const { destinations } = DestinationStore();
const { activities } = ActivityStore();
const { activitiesDes } = ActivityDesStore();
const { attractions } = AttractionsStore();

const destinationOptions = computed(() => {
	return (
		destinations?.data?.map((d) => ({
			value: d.name,
			label: d.destination_name,
		})) || []
	);
});

const noteColumns = [
	{ title: "Note", dataIndex: "note" },
	{ title: "Action", dataIndex: "Action", key: "Action" },
];

const difficultyOptions = [{ value: "Easy" }, { value: "Moderate" }, { value: "Challenging" }];

const accomodationOptions = [
	{ value: "Camping" },
	{ value: "Hotel" },
	{ value: "Ger Camp" },
	{ value: "Not included" },
];

const terrainOptions = [
	{ value: "Paved roads" },
	{ value: "Paved & gravel" },
	{ value: "Mixed paved & dirt" },
	{ value: "Desert tracks" },
	{ value: "Mountain roads" },
];

const tour = createDocumentResource({
	doctype: "Tour",
	name: props.name,
	auto: true,
});

const getActivityOptions = (destination) => {
	return activitiesDes?.data[destination] || [];
};

const getAttractionOptions = (destination) => {
	return attractions.data
		.filter((item) => item.destination === destination)
		.map((item) => item.name);
};
const dayAttraction = computed({
	get() {
		const dayatt = tour.doc.attractions?.filter((n) => n.day === current.value) || [];
		return dayatt.map((a) => a.attraction);
	},
	set(newNames) {
		if (!Array.isArray(tour.doc.attractions)) {
			tour.doc.attractions = [];
		}

		const currentDay = current.value;
		const existingattractions = tour.doc.attractions.filter((n) => n.day === currentDay);
		const existingNames = existingattractions.map((a) => a.attraction);

		// 1️⃣ Add new checked ones
		newNames.forEach((name) => {
			if (!existingNames.includes(name)) {
				tour.doc.attractions.push({
					day: currentDay,
					attraction: name,
					parent: tour.doc.name,
					parenttype: "Tour",
					parentfield: "attractions",
				});
			}
		});

		// 2️⃣ Remove unchecked ones
		tour.doc.attractions = tour.doc.attractions.filter((a) => {
			if (a.day !== currentDay) return true; // keep other days
			return newNames.includes(a.attraction); // keep only checked ones
		});
	},
});

const dayActivity = computed({
	get() {
		const dayacts = tour.doc.activities?.filter((n) => n.day === current.value) || [];
		return dayacts.map((a) => a.activity_name);
	},
	set(newNames) {
		if (!Array.isArray(tour.doc.activities)) {
			tour.doc.activities = [];
		}

		const currentDay = current.value;
		const existingActivities = tour.doc.activities.filter((n) => n.day === currentDay);
		const existingNames = existingActivities.map((a) => a.activity_name);

		// 1️⃣ Add new checked ones
		newNames.forEach((name) => {
			if (!existingNames.includes(name)) {
				tour.doc.activities.push({
					day: currentDay,
					activity_name: name,
					parent: tour.doc.name,
					parenttype: "Tour",
					parentfield: "activities",
				});
			}
		});

		// 2️⃣ Remove unchecked ones
		tour.doc.activities = tour.doc.activities.filter((a) => {
			if (a.day !== currentDay) return true; // keep other days
			return newNames.includes(a.activity_name); // keep only checked ones
		});
	},
});

const current = ref(1);
watch(
	() => tour?.doc?.duration,
	(duration) => {
		for (let i = 1; i <= duration; i++) {
			const exists = tour.doc.accomodation.some((a) => a.day === i);
			if (!exists) {
				tour.doc.accomodation.push({
					day: i,
					title: "",
					destination: null,
					difficulty: null,
					accomodation: null,
					distance: null,
					drive_time: null,
					terrain: null,
					altitude: null,
					parent: tour.doc.name, // 👈 important
					parenttype: "Tour", // 👈 important
					parentfield: "accomodation", // 👈 important
					doctype: "Tour Accomodation", // 👈 child table doctype
				});
			}
		}
	},
	{ immediate: true },
);

const notes = computed(() => {
	return tour.doc.notes?.filter((n) => n.day === current.value) || [];
});

const addNote = () => {
	tour.doc.notes.push({
		day: current.value,
		note: "",
		parent: tour.doc.name,
		parenttype: "Tour",
		parentfield: "notes",
		doctype: "Tour Note",
	});
};
const deleteNote = (note) => {
	if (!tour.doc.notes || !Array.isArray(tour.doc.notes)) return;
	if (note.name) {
		tour.doc.notes = tour.doc.notes.filter((n) => n.name !== note.name);
	} else {
		tour.doc.notes = tour.doc.notes.filter((n) => n !== note);
	}
	message.success("Note deleted");
};

const duplicateLoading = ref(false);
const duplicateDoc = () => {
	duplicateLoading.value = true;
	createResource({
		url: "zendmen_travel.api.duplicate_tour",
		params: {
			name: tour.doc.name,
		},
		method: "POST",
		auto: true,
		onSuccess(data) {
			router.push({ name: "Tour", params: { name: data } });
			duplicateLoading.value = false;
			message.success("Successfully duplicated tour");
		},
	});
};

const saveDoc = async () => {
	try {
		tour.save.submit();
		message.success("Successflly saved", 2);
	} catch (error) {
		message.error(error.message, 2);
	}
};
const pdfOpen = ref(false);
const pdfContent = ref(null);

const downloadPDF = async () => {
	try {
		const el = pdfContent.value;
		if (!el) {
			console.error("No element found for PDF");
			return;
		}

		// Wait for DOM to fully render
		await nextTick();
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Render element to canvas
		const canvas = await html2canvas(el, {
			scale: 2,
			useCORS: true,
			allowTaint: true,
			scrollY: -window.scrollY,
			backgroundColor: "#ffffff",
		});

		const imgData = canvas.toDataURL("image/png");

		const pdf = new jsPDF("p", "pt", "a4");
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		const margin = 40;
		const usableWidth = pageWidth - margin * 2;
		const imgHeight = (canvas.height * usableWidth) / canvas.width;

		let heightLeft = imgHeight;
		let position = margin;

		// Add first page
		pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
		heightLeft -= pageHeight - margin * 2;

		// Add remaining pages
		while (heightLeft > 0) {
			pdf.addPage();
			position = heightLeft - imgHeight + margin;
			pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
			heightLeft -= pageHeight - margin * 2;
		}

		pdf.save(`${tour.doc.tour_name || "Tour"}.pdf`);
	} catch (err) {
		console.error("❌ PDF generation failed:", err);
	}
};

const newDestination = ref("");

const addDestination = (e) => {
	e.preventDefault();
	destinations.insert.submit({ destination_name: newDestination.value });
	newDestination.value = "";
	// setTimeout(() => {
	//     inputRef.value?.focus();
	// }, 0);
};

const VNodes = defineComponent({
	props: {
		vnodes: {
			type: Object,
			required: true,
		},
	},
	render() {
		return this.vnodes;
	},
});
const handleFileUpload = (file) => {
	tour.doc.image = file.file_url;
};
</script>
