<template>
    <div class="flex flex-col h-full  overflow-y-auto">
        <a-page-header class="!p-0 !mb-2" :title="employee?.doc?.first_name || props.name"
            v-bind="{ onBack: () => $router.go(-1) }" :sub-title="props.name">
            <template #tags>
                <a-tag v-if="employee?.isDirty" color="orange">Not saved</a-tag>
            </template>
            <template #extra>
                <a-button type="primary" :loading="employee.save.loading" @click="saveDoc">Save</a-button>
            </template>
        </a-page-header>
        <div class="relative w-full flex-1 bg-white p-1 ">
            <a-spin :spinning="employee?.get?.loading" tip="Loading..." size="small">
                <a-empty v-if="!employee?.doc" description="employee not found" />

                <a-tabs v-else v-model:activeKey="current" tab-position="top" type="card">
                    <a-tab-pane key="main" tab="Үндсэн">
                        <a-form layout="vertical" :model="employee.doc"
                            class="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-2">
                            <div class="p-2">
                                <FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false"
                                    @success="(file) => { employee.doc.image = file.file_url }" class="border-none">
                                    <template #default="{ openFileSelector }">
                                        <div class="border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                                            @click="openFileSelector">
                                            <img v-if="employee.doc.image" :src="employee.doc.image" alt="avatar"
                                                class="w-full h-60 object-cover" />
                                            <div v-else
                                                class="min-h-40 flex items-center justify-center text-gray-500 text-sm">
                                                Upload Image
                                            </div>
                                        </div>
                                    </template>
                                </FileUploader>
                                <a-form-item name="first_name" label="First name">
                                    <a-input type="text" v-model:value="employee.doc.first_name"></a-input>
                                </a-form-item>
                                <a-form-item name="last_name" label="Last name">
                                    <a-input type="text" v-model:value="employee.doc.last_name"></a-input>
                                </a-form-item>
                                <a-form-item name="phone" label="Phone">
                                    <a-input type="text" v-model:value="employee.doc.phone"></a-input>
                                </a-form-item>
                                <a-form-item name="email" label="Email">
                                    <a-input type="text" v-model:value="employee.doc.email"></a-input>
                                </a-form-item>
                            </div>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>

            </a-spin>
        </div>
    </div>

</template>
<script setup>
import { createDocumentResource, FileUploader } from 'frappe-ui';
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

const current = ref('main')


const employee = createDocumentResource({
    doctype: 'Employee',
    name: props.name,
    auto: true
})


const saveDoc = async () => {
    try {
        employee.save.submit()
    }
    catch (error) {
        message.error(error?.message || 'Error on save', 2)
    }
}


</script>
