<template>
    <a-page-header class="!p-0 !mb-2" title="Lead" @back="() => $router.go(-1)">
        <template #extra>
            <!-- <a-button @click="duplicateDoc()" :loading="duplicateLoading" type="default">
                Duplicate
            </a-button>
            <a-button @click="pdfOpen = true" :loading="false" type="dashed">
                show pdf
            </a-button> -->
            <a-button @click="saveDoc()" :loading="!!lead?.save?.loading" type="primary">
                Save
            </a-button>
        </template>
    </a-page-header>
    <div class="w-full  rounded bg-white p-4">
        <a-spin :spinning="lead.get.loading"></a-spin>
        <div v-if="!lead.get.loading">
            <div class="border-b">
                <div class="text-xl font-semibold">Customer Details</div>
                <a-form class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 !mt-2" layout="vertical">
                    <a-form-item label="Customer">
                        <a-input v-model:value="lead.doc.customer" />
                    </a-form-item>
                    <a-form-item label="Email">
                        <a-input v-model:value="lead.doc.email" />
                    </a-form-item>
                    <a-form-item label="Company name">
                        <a-input v-model:value="lead.doc.company_name" />
                    </a-form-item>
                    <a-form-item label="Country">
                        <a-input v-model:value="lead.doc.country" />
                    </a-form-item>
                    <a-form-item label="Whatsapp">
                        <a-input v-model:value="lead.doc.whatsapp" />
                    </a-form-item>
                </a-form>
            </div>
            <div class="border-b">
                <div class="text-xl font-semibold mt-2">Lead Details</div>
                <a-form class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 !mt-2" layout="vertical">
                    <a-form-item label="Age (average)">
                        <a-input v-model:value="lead.doc.age" />
                    </a-form-item>
                    <a-form-item :colon="false" labelAlign="left" label="Group size">
                        <a-space>
                            <a-input-number v-model:value="lead.doc.group_min" :min="1" :max="20" addon-before="min" />
                            <a-input-number v-model:value="lead.doc.group_max" :min="1" :max="20" addon-before="max" />
                        </a-space>
                    </a-form-item>
                    <a-form-item label="Comfort type">
                        <a-select v-model:value="lead.doc.comfort_type" :options="comfortOptions" />
                    </a-form-item>
                    <a-form-item label="Season">
                        <a-input v-model:value="lead.doc.season" />
                    </a-form-item>
                    <a-form-item label="Duration">
                        <a-input v-model:value="lead.doc.duration" />
                    </a-form-item>
                    <a-form-item label="Nationality">
                        <a-input v-model:value="lead.doc.nationality" />
                    </a-form-item>
                    <a-form-item label="Group Type">
                        <a-select v-model:value="lead.doc.group_type" :options="groupTypes" />
                    </a-form-item>
                    <a-form-item label="Interest">
                        <a-textarea v-model:value="lead.doc.interest" :row="3" />
                    </a-form-item>
                    <a-form-item label="Year">
                        <a-checkbox-group v-model:value="leadYear" :options="getYearOptions()" />
                    </a-form-item>
                </a-form>
            </div>
            <div class="">
                <div class="text-xl font-semibold mt-2">Notes</div>
                <a-form class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 !mt-2" layout="vertical">
                    <a-form-item label="Note">
                        <a-textarea v-model:value="lead.doc.note" row="6" />
                    </a-form-item>
                    <a-form-item label="Follow up Requests">
                        <a-textarea v-model:value="lead.doc.follow_up_requests" :row="6" />
                    </a-form-item>
                    <a-form-item label="Business Cart">
                        <FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false"
                            @success="(file)=>{lead.doc.image = file.file_url}" class="border-none">
                            <template #default="{ openFileSelector }">
                                <div class="border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                                    @click="openFileSelector">
                                    <img v-if="lead.doc.image" :src="lead.doc.image" alt="avatar"
                                        class="w-full h-56 object-cover" />
                                    <div v-else class="min-h-40 flex items-center justify-center text-gray-500 text-sm">
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
</template>
<script setup>
import { createDocumentResource, FileUploader } from 'frappe-ui';
import { computed } from 'vue';

import { message } from 'ant-design-vue';



const props = defineProps({
    name: {
        type: String,
        required: true
    }
})


const lead = createDocumentResource({
    doctype: 'Lead',
    name: props.name,
    auto: true
})


const groupTypes = [
    {
        value: 'Family'
    },
    {
        value: 'Friends'
    },
    {
        value: 'Colleages'
    },
]
const comfortOptions = [
    {
        value: 'Budget'
    },
    {
        value: 'Luxury'
    },
    {
        value: 'Comfort'
    },
]

const getYearOptions = () => lead.doc.year.map(item => item.year);

const leadYear = computed({
    get() {
        const checked = lead.doc.year?.filter(n => n.checked == 1) || []
        return checked.map(a => a.year)
    },
    set(years) {
        lead.doc.year.forEach(item => {
            item.checked = years.includes(item.year) ? 1 : 0;
        });
    }
})

const saveDoc = async () => {
    try {
        lead.save.submit()
        message.success('Successflly saved', 2)
    }
    catch (error) {
        message.error(error.message, 2)
    }
}
</script>

<style scoped>
:deep(input[type="file"]) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
}
</style>