<template>
	<a-page-header class="!p-0 !mb-2" title="Lead">
		<template #extra>
			<a-button
				@click="leads.reload()"
				:loading="leads.list.loading"
				class="!flex justify-center items-center"
			>
				<template #icon>
					<FeatherIcon name="refresh-ccw" class="size-4" />
				</template>
			</a-button>
			<a-button type="primary" @click="handleCreate">Create lead</a-button>
		</template>
	</a-page-header>
	<a-table
		:columns="columns"
		:data-source="leads.data"
		size="small"
		:loading="leads.list.loading"
		:pagination="false"
		row-key="name"
		:scroll="{ y: 'calc(100vh - 280px)' }"
		:customRow="onRow"
	>
	</a-table>
	<a-button class="mt-2" @click="leads.next()" :loading="leads.list.loading">load more</a-button>
	<a-modal v-model:open="open" title="New lead" okText="Create" @ok="createLead">
		<a-form :model="newLead" :rules="newLeadRules" layout="vertical">
			<a-form-item label="Customer" name="customer">
				>
				<a-input v-model:value="newLead.customer" placeholder="customer name" />
			</a-form-item>
			<a-form-item label="Email" name="email">
				<a-input v-model:value="newLead.email" placeholder="Email" />
			</a-form-item>
			<a-form-item label="Company name" name="company_name">
				<a-input v-model:value="newLead.company_name" placeholder="Company Name" />
			</a-form-item>
			<a-form-item label="Country" name="country">
				<!-- <a-input v-model:value="newLead.country" placeholder="Country" /> -->
				<a-select
					v-model:value="newLead.country"
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
				<a-input v-model:value="newLead.whatsapp" placeholder="whatsapp" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup>
import { createListResource } from "frappe-ui";
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { CountryStore } from "@/data/country";

const { countrys } = CountryStore();

const countryOptions = computed(
	() =>
		countrys?.data.map((item) => ({
			label: item.name,
			value: item.name,
		})) || [],
);

const router = useRouter();
const open = ref(false);

const newLead = reactive({
	customer: "",
	email: "",
	company_name: "",
	country: "",
	whatsapp: "",
});
const newLeadRules = {};

const leads = createListResource({
	doctype: "Lead",
	fields: ["name", "customer", "email", "company_name", "country", "whatsapp"],
	auto: true,
	pageLength: 20,
});

const columns = [
	{ title: "Customer", key: "customer", dataIndex: "customer" },
	{ title: "Email", key: "email", dataIndex: "email" },
	{ title: "Company name", key: "company_name", dataIndex: "company_name" },
	{ title: "Country", key: "country", dataIndex: "country" },
	{ title: "Whatsapp", key: "whatsapp", dataIndex: "whatsapp" },
];

const onRow = (record) => ({
	onClick: () => {
		router.push({ name: "Lead", params: { name: record.name } });
	},
});

const handleCreate = async () => {
	open.value = true;
};
const createLead = async () => {
	try {
		await leads.insert.submit({ ...newLead });
		message.success("Successfully created lead ", 2);
	} catch (error) {
		message.error(error.message || "Failed to create lead", 2);
	} finally {
		open.value = false;
	}
};
</script>
