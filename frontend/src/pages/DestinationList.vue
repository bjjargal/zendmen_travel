<template>
    <a-page-header class="!p-0 !mb-2" title="Destinations">
        <template #extra>
            <a-button type="primary" @click="handleCreate">Create destination</a-button>
        </template>
    </a-page-header>

    <!-- Main destination list -->
    <a-table :columns="columns" :data-source="destinations.data" size="small" :loading="destinations.list.loading"
        :pagination="false" row-key="name" :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Action'">
                <div class="flex gap-2">
                    <a-button @click="editDestination(record.name)" type="primary"
                        class="!flex justify-center items-center">
                        <template #icon>
                            <FeatherIcon name="edit" class="size-4" />
                        </template>
                    </a-button>
                    <a-button @click="deleteDestination(record.name)" danger type="primary"
                        class="!flex justify-center items-center">
                        <template #icon>
                            <FeatherIcon name="trash-2" class="size-4" />
                        </template>
                    </a-button>
                </div>
            </template>
        </template>
    </a-table>

    <!-- Destination Modal -->
    <a-modal v-model:open="open" width="50%" :title="`Destination: ${formModel?.destination_name || ''}`"
        @ok="handleSave" :loading="saving" @cancel="handleCancel">
        <a-form :form="createFormRef" :model="formModel" :rules="formRules" layout="vertical">
            <a-form-item label="Destination Name" name="destination_name">
                <a-input v-model:value="formModel.destination_name" placeholder="Enter destination name" />
            </a-form-item>

            <a-form-item label="Description" name="description">
                <a-textarea :rows="6" v-model:value="formModel.description" placeholder="Enter description" />
            </a-form-item>

            <!-- Attractions Table -->
            <a-form-item label="Attractions">
                <a-table :columns="attractionColumns" :data-source="filteredAttractions" size="small"
                    :loading="attractions.list.loading" :pagination="false" row-key="name">
                    <template #bodyCell="{ column, record }">
                        <template v-if="['attraction_name', 'type'].includes(column.dataIndex)">
                            <div>
                                <a-input v-if="editableData[record.name] && column.dataIndex === 'attraction_name'"
                                    v-model:value="editableData[record.name][column.dataIndex]"
                                    style="margin: -5px 0" />
                                <a-select v-else-if="editableData[record.name] && column.dataIndex === 'type'"
                                    :options="attractionTypes"
                                    v-model:value="editableData[record.name][column.dataIndex]"
                                    style="margin: -5px 0" />
                                <template v-else>{{ record[column.dataIndex] }}</template>
                            </div>
                        </template>

                        <!-- Action buttons -->
                        <template v-if="column.key === 'Action'">
                            <div class="flex gap-2">
                                <template v-if="editableData[record.name]">
                                    <a-typography-link @click="saveAttraction(record.name)">Save</a-typography-link>
                                    <a-typography-link @click="cancelEdit(record.name)">Cancel</a-typography-link>
                                </template>
                                <template v-else>
                                    <a-button @click="editAttraction(record.name)" type="primary"
                                        class="!flex justify-center items-center">
                                        <template #icon>
                                            <FeatherIcon name="edit" class="size-4" />
                                        </template>
                                    </a-button>
                                    <a-button @click="deleteAttraction(record.name)" danger type="primary"
                                        class="!flex justify-center items-center">
                                        <template #icon>
                                            <FeatherIcon name="trash-2" class="size-4" />
                                        </template>
                                    </a-button>
                                </template>
                            </div>
                        </template>
                    </template>
                </a-table>
                <a-button class="mt-2" @click="handleAddAttraction">Add attraction</a-button>
            </a-form-item>
        </a-form>

        <!-- Images Section -->
        <!-- <div v-if="formModel.images?.length" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div class="grid grid-cols-2 gap-2">
                <div v-for="(image, index) in formModel.images" :key="image.image"
                    class="border rounded p-2 flex flex-col justify-between">
                    <a-image :src="image.image" :alt="image.title" class="w-full h-32 object-cover mb-2" />
                    <a-input v-model:value="formModel.images[index].title" size="small" placeholder="Image title"
                        class="text-xs" />
                </div>
            </div>
        </div> -->
        <FileUploader :fileTypes="['jpg', 'jpeg', 'png']" :multiple="false" @success="handleFileUpload">
            <template #default="{ openFileSelector }">
                <div class="rounded overflow-hidden cursor-pointer" @click="openFileSelector">
                    <img v-if="formModel?.image" :src="formModel.image" alt="preview"
                        class="w-full h-auto object-cover" />
                    <div v-else
                        class="w-full border rounded border-dotted hover:border-blue-500 flex justify-center h-40 items-center bg-gray-50">
                        Upload Image
                    </div>
                </div>
            </template>
        </FileUploader>

        <!-- Image Upload Modal -->
        <!-- <a-modal v-model:open="imageOpen" title="New destination image" @ok="handleImage" @cancel="imageOpen = false">
            <a-form :form="imageFormRef" :model="newImageForm" :rules="imageFormRules" layout="vertical">
                <a-form-item label="Title" name="title">
                    <a-input v-model:value="newImageForm.title" placeholder="Enter title" />
                </a-form-item>
            </a-form>
            
        </a-modal> -->

        <a-modal v-model:open="attractionOpen" title="Add Attraction" @ok="handleSaveAttraction"
            :loading="attractionSaving" @cancel="handleCancelAttraction">
            <a-form :form="attractionFormRef" :model="newAttractionForm" :rules="attractionFormRules" layout="vertical">
                <a-form-item label="Attraction Name" name="attraction_name">
                    <a-input v-model:value="newAttractionForm.attraction_name" placeholder="Enter attraction name" />
                </a-form-item>
                <a-form-item label="Type" name="type">
                    <a-select v-model:value="newAttractionForm.type" :options="attractionTypes"
                        placeholder="Select type" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-modal>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from 'vue'
import { message } from 'ant-design-vue'
import { DestinationStore } from '@/data/destinations'
import { AttractionsStore } from '@/data/Attraction'
import { createDocumentResource, FileUploader } from 'frappe-ui'
import { cloneDeep } from 'lodash-es'

const { destinations } = DestinationStore()
const { attractions } = AttractionsStore()
const attractionTypes = [{
    value: 'Monastery'
},
{
    value: 'Museum'
},
{
    value: 'Photo Site'
},
{
    value: 'Monument'
}
]
const open = ref(false)
const imageOpen = ref(false)
const attractionOpen = ref(false)
const saving = ref(false)
const attractionSaving = ref(false)
const isCreate = ref(false)
const destinationName = ref('')
const editableData = reactive({})


const destination = createDocumentResource({
    doctype: 'Destination',
    name: destinationName,
    auto: false,
})


const createFormRef = ref(null)
const imageFormRef = ref(null)
const attractionFormRef = ref(null)
const formModel = ref(null)


const newImageForm = reactive({ title: '', image: '' })


const newAttractionForm = reactive({ attraction_name: '', type: '' })


const formRules = {
    destination_name: [{ required: true, message: 'Please enter destination name' }],
}
const imageFormRules = {
    title: [{ required: true, message: 'Please enter image title' }],
}
const attractionFormRules = {
    attraction_name: [{ required: true, message: 'Please enter attraction name' }],
    type: [{ required: true, message: 'Please select type' }],
}

// Filtered attractions computed
const filteredAttractions = computed(() => {
    const currentDestName = formModel.value?.name || ''
    return attractions.data.filter(attr => attr.destination === currentDestName)
})

// TABLE COLUMNS
const columns = [
    { title: 'Destination Name', key: 'destination_name', dataIndex: 'destination_name' },
    { title: 'Action', key: 'Action', width: '15%' },
]

const attractionColumns = [
    { title: 'Attraction Name', dataIndex: 'attraction_name' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Action', key: 'Action' },
]

// DESTINATION CRUD
const handleCreate = async () => {
    isCreate.value = true
    formModel.value = reactive({ destination_name: '', description: '', images: [] })
    open.value = true

}

const editDestination = async (name) => {
    try {
        isCreate.value = false
        destinationName.value = name
        destination.name = name
        await destination.reload()
        formModel.value = destination.doc
        open.value = true
    } catch (error) {
        message.error(error.message)
    }
}

const deleteDestination = async (name) => {
    try {
        await destinations.delete.submit(name)
        await destinations.reload()
        message.success('Destination deleted successfully')
    } catch (error) {
        message.error('Failed to delete destination')
    }
}

const handleSave = async () => {
    try {
        saving.value = true
        if (isCreate.value) {
            await destinations.insert.submit({ ...formModel.value })
            message.success('Destination created successfully')
        } else {
            await destination.save.submit()
            message.success('Destination updated successfully')
        }
        await destinations.reload()
        open.value = false
    } catch (error) {
        message.error(error.message || 'Failed to save')
    } finally {
        saving.value = false
    }
}

const handleCancel = () => {
    open.value = false

}

// ATTRACTION CRUD
const handleAddAttraction = () => {
    newAttractionForm.attraction_name = ''
    newAttractionForm.type = ''
    newAttractionForm.destination = formModel.value?.name || ''
    attractionOpen.value = true

}

const handleSaveAttraction = async () => {
    try {
        attractionSaving.value = true
        await attractions.insert.submit({ ...newAttractionForm })
        message.success('Attraction created successfully')
        await attractions.reload()
        attractionOpen.value = false
    } catch (error) {
        if (error.errorFields) {
            message.error('Please fix the errors below')
        } else {
            message.error('Failed to create attraction')
            console.error('Create error:', error)
        }
    } finally {
        attractionSaving.value = false
    }
}

const handleCancelAttraction = () => {
    attractionOpen.value = false
}

// ATTRACTION EDIT TABLE LOGIC
const editAttraction = (name) => {
    const item = filteredAttractions.value.find((a) => a.name === name)
    if (item) editableData[name] = cloneDeep(item)
}

const saveAttraction = async (name) => {
    try {
        await attractions.setValue.submit(editableData[name])
        message.success('Attraction updated')
        delete editableData[name]
        await attractions.reload()
    } catch (e) {
        message.error('Failed to update')
    }
}

const cancelEdit = (name) => delete editableData[name]

const deleteAttraction = async (name) => {
    try {
        await attractions.delete.submit(name)
        await attractions.reload()
        message.success('Attraction deleted')
    } catch (error) {
        message.error('Failed to delete attraction')
    }
}

// IMAGE HANDLERS
const handleFileUpload = (file) => (formModel.value.image = file.file_url)
// const handleImage = () => {
//     formModel.value.images.push({ title: newImageForm.title, image: newImageForm.image })
//     Object.assign(newImageForm, { title: '', image: '' })
//     imageOpen.value = false
//     message.success('Image added')
// }
</script>