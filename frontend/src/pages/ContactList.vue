<template>
    <a-page-header class="!p-0 !mb-2" title="Contacts">
        <template #extra>
            <!-- <a-button type="primary" @click="handleCreate">Create activity</a-button> -->
        </template>
    </a-page-header>
    <div class="overflow-x-auto">
        <a-table :columns="columns" :data-source="contacts.data" size="small" :loading="contacts.list.loading"
            :pagination="false" row-key="name" :scroll="{ x: 800, y: 'calc(100vh - 280px)' }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'Action'">
                    <div class="flex gap-2 justify-center">
                        <a-button @click="edit(record.name)" type="ghost" class="!flex justify-center items-center">
                            <template #icon>
                                <FeatherIcon name="edit" class="size-4" />
                            </template>
                        </a-button>
                        <!-- <a-button @click="deleteRecord(record.name)" type="ghost" danger
                            class="!flex justify-center items-center !text-red-500">
                            <template #icon>
                                <FeatherIcon name="trash-2" class="size-4" />
                            </template>
                        </a-button> -->
                    </div>
                </template>
            </template>
        </a-table>
    </div>
    <a-modal v-model:open="open" title="Contacts" okText='Save' @ok="handleSave">
        <a-form :model="contact?.doc" layout="vertical">
            <a-form-item label="Contact Name" name="contact_name">
                <a-input v-model:value="contact.doc.contact_name"></a-input>
            </a-form-item>
            <a-form-item label="Position" name="position">
                <a-input v-model:value="contact.doc.position"></a-input>
            </a-form-item>
            <a-form-item label="Company name" name="company_name">
                <a-input v-model:value="contact.doc.company_name"></a-input>
            </a-form-item>
            <a-form-item label="email" name="email">
                <a-input v-model:value="contact.doc.email"></a-input>
            </a-form-item>
            <a-form-item label="whatsapp" name="whatsapp">
                <a-input v-model:value="contact.doc.whatsapp"></a-input>
            </a-form-item>

            <a-form-item label="Country" name="country">
                <a-select v-model:value="contact.doc.country" :options="countryOptions" :loading="countrys.list.loading"
                    placeholder="Select country" :showSearch="true" :show-arrow="false" option-filter-prop="label"
                    :filter-option="true" :not-found-content="null" />
            </a-form-item>

            <a-form-item label="Other information" name="other_information">
                <a-textarea v-model:value="contact.doc.other_information" :rows="4"></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>

</template>


<script setup>
import { createListResource, createDocumentResource } from 'frappe-ui';
import { message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { CountryStore } from "@/data/country";


const { countrys } = CountryStore();



const contacts = createListResource({
    doctype: 'Lead Contacts',
    fields: ['name', 'contact_name', 'position', 'company_name', 'email', 'whatsapp', 'country'],
    auto: true,
    pageLength: 20,
})

const open = ref(false)
const contactName = ref('')

const contact = createDocumentResource({
    doctype: 'Lead Contacts',
    name: contactName,
    auto: false
})
const countryOptions = computed(() =>
    countrys?.data.map((item) => ({
        label: item.name,
        value: item.name,
    })) || [],
);

const deleteRecord = async (name) => {
    try {
        await contacts.delete.submit(name)
        await contacts.reload()
        message.success('Successfully deleted activity', 2)
    } catch (error) {
        message.error(error.message || 'Failed to delete activity', 2)
    }
}

const edit = async (name) => {
    try {
        contactName.value = name
        contact.name = name
        await contact.reload()
        open.value = true
    } catch (error) {
        message.error({ content: error.message, duration: 5 })
    }
}

const handleSave = async () => {
    try {

        await contact.save.submit();
        message.success("Destination updated successfully");
        open.value = false;
    } catch (error) {
        message.error(error.message || "Failed to save");
    }
};

const columns = [
    {
        title: 'Contact name',
        key: 'contact_name',
        dataIndex: 'contact_name',
    },
    {
        title: 'Position',
        key: 'position',
        dataIndex: 'position',
    },
    {
        title: 'Company name',
        key: 'company_name',
        dataIndex: 'company_name',
    },
    {
        title: 'Email',
        key: 'email',
        dataIndex: 'email',
    },
    {
        title: 'Whatsapp',
        key: 'whatsapp',
        dataIndex: 'whatsapp',
    },
    {
        title: 'Country',
        key: 'country',
        dataIndex: 'country',
    },
    {
        title: 'Action',
        key: 'Action',
        width: '10%',
        fixed: 'right',
    }
]
</script>