<template>
	<a-page-header class="!p-0 !mb-2" title="Oppertunity" @back="() => $router.go(-1)">
		<template #tags>
			<a-tag v-if="oppertunity?.isDirty" color="orange">Not saved</a-tag>
		</template>
		<template #extra>
			<a-button @click="oppOpen = true">Create Opportunity</a-button>
			<a-button @click="createContact">Create contact</a-button>
			<a-button @click="saveDoc()" :loading="oppertunity?.save?.loading" type="primary">
				Save
			</a-button>
		</template>
	</a-page-header>
	<div class="w-full rounded bg-white p-4">
		<a-spin :spinning="oppertunity.get.loading"></a-spin>
		<div v-if="!oppertunity.get.loading">
			<div class="border-b">
				<div class="text-xl font-semibold">Customer Details</div>
				<a-form
					class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 !mt-2"
					layout="vertical"
				>
					<a-form-item label="Customer" name="customer">
						<a-input v-model:value="oppertunity.doc.customer" />
					</a-form-item>
					<a-form-item label="Email" name="email">
						<a-input v-model:value="oppertunity.doc.email" />
					</a-form-item>
					<a-form-item label="Company name" name="company_name">
						<a-input v-model:value="oppertunity.doc.company_name" />
					</a-form-item>
					<a-form-item label="Country" name="country">
						<a-select
							v-model:value="oppertunity.doc.country"
							:options="countryOptions"
							:loading="countrys.list.loading"
							placeholder="Select country"
							:showSearch="true"
							:show-arrow="false"
							option-filter-prop="label"
							:filter-option="true"
							:not-found-content="null"
						/>
					</a-form-item>
					<a-form-item label="Whatsapp" name="whatsapp">
						<a-input v-model:value="oppertunity.doc.whatsapp" />
					</a-form-item>
				</a-form>
			</div>
			<div class="border-b">
				<div class="text-xl font-semibold mt-2">oppertunity Details</div>
				<a-form
					class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 !mt-2"
					layout="vertical"
				>
					<a-form-item label="Age (average)" name="age">
						<a-input v-model:value="oppertunity.doc.age" />
					</a-form-item>
					<a-form-item
						:colon="false"
						labelAlign="left"
						label="Group size"
						name="group_size"
					>
						<a-space>
							<a-input-number
								v-model:value="oppertunity.doc.group_min"
								:min="1"
								:max="20"
								addon-before="min"
							/>
							<a-input-number
								v-model:value="oppertunity.doc.group_max"
								:min="1"
								:max="20"
								addon-before="max"
							/>
						</a-space>
					</a-form-item>
					<a-form-item label="Comfort type" name="comfort_type">
						<a-select
							v-model:value="oppertunity.doc.comfort_type"
							:options="comfortOptions"
						/>
					</a-form-item>
					<a-form-item label="Season" name="season">
						<a-input v-model:value="oppertunity.doc.season" />
					</a-form-item>
					<a-form-item label="Duration" name="duration">
						<a-input v-model:value="oppertunity.doc.duration" />
					</a-form-item>
					<a-form-item label="Nationality" name="nationality">
						<a-input v-model:value="oppertunity.doc.nationality" />
					</a-form-item>
					<a-form-item label="Group Type" name="group_type">
						<a-select
							v-model:value="oppertunity.doc.group_type"
							:options="groupTypes"
						/>
					</a-form-item>
					<a-form-item label="Interest" name="interest">
						<a-textarea v-model:value="oppertunity.doc.interest" :row="3" />
					</a-form-item>
					<a-form-item label="Year" name="year">
						<a-checkbox-group
							v-model:value="oppertunityYear"
							:options="getYearOptions()"
						/>
					</a-form-item>
				</a-form>
			</div>
			<div class="">
				<div class="text-xl font-semibold mt-2">Notes</div>
				<a-form
					class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 !mt-2"
					layout="vertical"
				>
					<a-form-item label="Note" name="note">
						<a-textarea v-model:value="oppertunity.doc.note" row="6" />
					</a-form-item>
					<a-form-item label="Follow up Requests" name="follow_up_requests">
						<a-textarea v-model:value="oppertunity.doc.follow_up_requests" :row="6" />
					</a-form-item>
					<a-form-item label="Business Cart" name="image">
						<FileUploader
							:fileTypes="['jpg', 'jpeg', 'png']"
							:multiple="false"
							@success="
								(file) => {
									oppertunity.doc.image = file.file_url;
								}
							"
							class="border-none"
						>
							<template #default="{ openFileSelector }">
								<div
									class="border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
									@click="openFileSelector"
								>
									<img
										v-if="oppertunity.doc.image"
										:src="oppertunity.doc.image"
										alt="avatar"
										class="w-full h-56 object-cover"
									/>
									<div
										v-else
										class="min-h-40 flex items-center justify-center text-gray-500 text-sm"
									>
										Upload Image
									</div>
								</div>
							</template>
						</FileUploader>
					</a-form-item>
				</a-form>
			</div>
		</div>
	</div>
	<a-modal title="New Opportunity" v-model:open="oppOpen" okText="Create" @ok="createOpertunity">
		<a-form :model="oppForm" layout="vertical">
			<a-form-item label="Assignee" name="assignee">
				<a-select
					v-model:value="oppForm.assignee"
					:options="employeeOptions"
					placeholder="Select assignee"
				>
					<template #option="{ label, value, image }">
						<div class="flex items-center gap-2">
							<a-avatar :src="image" size="small" />
							<div class="flex flex-col oppertunitying-tight">
								<span>{{ label }}</span>
								<span class="text-xs text-gray-400">{{ value }}</span>
							</div>
						</div>
					</template>
				</a-select>
			</a-form-item>
			<a-form-item label="Deadline" name="deadline">
				<a-date-picker
					v-model:value="oppForm.deadline"
					format="YYYY-MM-DD"
					valueFormat="YYYY-MM-DD"
					class="w-full"
				/>
			</a-form-item>
			<a-form-item label="Other information" name="other_information">
				<a-textarea v-model:value="oppForm.other_information" :rows="6"></a-textarea>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script setup>
import { createDocumentResource, FileUploader } from "frappe-ui";
import { computed, reactive, ref } from "vue";
import { CountryStore } from "@/data/country";
import { message } from "ant-design-vue";
import { EmployeeStore } from "../data/Employee";

const { employees } = EmployeeStore();

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
});

const { countrys } = CountryStore();

const countryOptions = computed(
	() =>
		countrys?.data.map((item) => ({
			label: item.name,
			value: item.name,
		})) || [],
);

const oppertunity = createDocumentResource({
	doctype: "Opportunity",
	name: props.name,
	auto: true,
	// whitelistedMethods: {
	//     createOpportunity: 'create_opportunity',
	//     createContact: 'create_contact'
	// },
});

const groupTypes = [
	{
		value: "Family",
	},
	{
		value: "Friends",
	},
	{
		value: "Colleages",
	},
];
const comfortOptions = [
	{
		value: "Budget",
	},
	{
		value: "Luxury",
	},
	{
		value: "Comfort",
	},
];

const getYearOptions = () => oppertunity.doc.year.map((item) => item.year);

const oppertunityYear = computed({
	get() {
		const checked = oppertunity.doc.year?.filter((n) => n.checked == 1) || [];
		return checked.map((a) => a.year);
	},
	set(years) {
		oppertunity.doc.year.forEach((item) => {
			item.checked = years.includes(item.year) ? 1 : 0;
		});
	},
});

const saveDoc = async () => {
	try {
		oppertunity.save.submit();
		message.success("Successflly saved", 2);
	} catch (error) {
		message.error(error.message, 2);
	}
};

const oppOpen = ref(false);
const oppForm = reactive({
	assignee: "",
	deadline: "",
	other_information: "",
});

const employeeOptions = computed(() => {
	return (
		employees?.data.map((employee) => ({
			value: employee.name,
			label: employee.first_name,
			image: employee.image,
		})) || []
	);
});

const createOpertunity = async () => {
	try {
		oppertunity.createOpportunity.submit({
			assignee: oppForm.assignee,
			deadline: oppForm.deadline,
			other_information: oppForm.other_information,
		});
		Object.assign(oppForm, {
			assignee: "",
			deadline: "",
			other_information: "",
		});
		message.success("Successfully created oppertunity", 2);
		oppOpen.value = false;
	} catch (error) {
		message.error(error?.message || "Error on creating opportunity", 2);
		oppOpen.value = false;
	}
};

const createContact = async () => {
	try {
		await oppertunity.createContact.submit();
		message.success("Successfully created contact", 2);
	} catch (error) {
		message.error(error?.message || "There is a error creating contact", 2);
	}
};
</script>
