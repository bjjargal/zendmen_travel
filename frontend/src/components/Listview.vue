<template>
    <div class="h-full flex flex-col">
        <a-page-header v-if="!hideHeader" class="!p-0 !mb-2" :title="title" v-bind="{ onBack: () => $router.go(-1) }">
            <template #extra>
                <a-button @click="listRequest.reload()" :loading="listRequest.list.loading"
                    class="!flex justify-center items-center">
                    <template #icon>
                        <FeatherIcon name="refresh-ccw" class="size-4" />
                    </template>
                </a-button>
            </template>
        </a-page-header>
        <div class="flex-1 w-full">
            <a-table ref="tableRef" :columns="columns" :data-source="listRequest.data" size="small"
                :loading="listRequest.list.loading" :pagination="false" row-key="name"
                :scroll="{ y: 'calc(100vh - 280px)' }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.badge">
                        <a-tag :color="column.badge[record[column.dataIndex]]">
                            {{ record[column.dataIndex] }}
                        </a-tag>
                    </template>
                    <template v-else-if="column?.link">
                        <div class="flex items-center gap-2">
                            <a-avatar v-if="column?.avatar" :src="column.avatar(record[column.dataIndex])"
                                size="large" />
                            <span>{{ column.link(record[column.dataIndex]) }}</span>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'Action'">
                        <a-button @click="openDoc(record.name)" type="ghost"
                            class="!flex justify-center items-center"><template #icon>
                                <FeatherIcon name="edit" class="size-4" />
                            </template> </a-button>
                    </template>
                    <template v-else>
                        <span>{{ record[column.dataIndex] }}</span>
                    </template>

                </template>
            </a-table>
            <a-button :disabled="total.data <= listRequest?.data?.length" class="mt-2" @click="listRequest.next()"
                :loading="listRequest.list.loading">load more</a-button>
        </div>
    </div>
    <a-modal v-model:open="open" width="70%" @ok="handleSave" @cancel="handleCancel">
        <a-spin :spinning="document.get.loading">
            <div class="flex gap-2 mb-2 items-center">
                <div class="font-bold text-xl">
                    {{ props.title }}
                </div>
                <div v-if="modalMeta?.tag">
                    <a-tag :color="modalMeta.tag.options[document.doc[modalMeta.tag.fieldname]]">
                        {{ document.doc[modalMeta.tag.fieldname] }}
                    </a-tag>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="w-[60%]">
                    <a-form :model="document.doc" layout="vertical" class="grid grid-cols-2 gap-2">
                        <a-col v-for="field in modalMeta.fields" :key="field.fieldname">
                            <a-form-item :label="field.label">
                                <template v-if="field.type === 'data' || field.type === 'link'">
                                    <a-input :disabled="field.disabled"
                                        :value="field.type === 'link' && field.link ? field.link(document.doc[field.fieldname]) : document.doc[field.fieldname]"
                                        placeholder="" readonly />
                                </template>
                                <template v-else-if="field.type === 'text'">
                                    <a-textarea v-model:value="document.doc[field.fieldname]" :rows="3"
                                        :disabled="field.disabled" placeholder="Enter description" />
                                </template>
                                <template v-else-if="field.type === 'datetime'">
                                    <a-date-picker v-model:value="document.doc[field.fieldname]" show-time
                                        :format="'YYYY-MM-DD HH:mm'" :value-format="'YYYY-MM-DD HH:mm:ss'"
                                        :disabled="field.disabled" style="width: 100%" />
                                </template>
                                <template v-else-if="field.type === 'date'">
                                    <a-date-picker v-model:value="document.doc[field.fieldname]" :format="'YYYY-MM-DD'"
                                        :value-format="'YYYY-MM-DD'" :disabled="field.disabled" style="width: 100%" />
                                </template>
                                <template v-else-if="field.type === 'select'">
                                    <a-select v-model:value="document.doc[field.fieldname]" :options="field.options"
                                        :disabled="field.disabled" placeholder="Select option" style="width: 100%" />
                                </template>
                                <template v-else>
                                    <a-input v-model:value="document.doc[field.fieldname]" placeholder="Enter value" />
                                </template>
                            </a-form-item>
                        </a-col>
                    </a-form>
                </div>
                <div class="flex-1 rounded border p-4 bg-gray-50">
                    <div class="mt-6">
                        <h3 class="font-semibold mb-2">Comments</h3>
                        <div class="border rounded p-3 bg-white">
                            <p class="text-gray-500 text-sm">Comment section will be developed later...</p>
                        </div>
                    </div>
                </div>
            </div>

        </a-spin>
        <template #footer>
            <div class="flex justify-end gap-2">
                <a-button v-for="action in modalMeta.actions" :key="action.action" :type="action.type || 'default'"
                    :danger="action.danger || false" @click="handleAction(action.action)">
                    {{ action.label }}
                </a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { createListResource, createResource, createDocumentResource } from 'frappe-ui';
import { message } from 'ant-design-vue'

const props = defineProps({
    doctype: {
        type: String,
        required: true
    },

    title: {
        type: String
    },
    filters: {
        type: Object,
        default: {}
    },
    pageLength: {
        type: Number,
        default: 20
    },
    hasAction: {
        type: Boolean,
        default: true
    },
    meta: {
        type: Object,
        required: true
    },

    hideHeader: {
        type: Boolean,
        default: false
    },
    modalMeta: {
        type: Object
    }
});

const DocName = ref('')

const open = ref(false)


const document = createDocumentResource({
    doctype: props.doctype,
    name: DocName,
    auto: false,
    whitelistedMethods: {
        ...props.modalMeta?.actions.reduce((acc, { action }) => {
            acc[action] = action;
            return acc;
        }, {})
    },
})

const handleAction = async (actionName) => {
    try {
        if (document[actionName]) {
            await document[actionName].submit()
        } else {
            await document[actionName]()
        }
        message.success(`Амжилттай ${actionName} хийгдлээ`)
        open.value = false
        listRequest.reload()
    } catch (error) {
        message.error({ content: error.message, duration: 1 })
    } finally {
        actionLoading.value[actionName] = false
    }
}



const openDoc = async (name) => {
    try {
        DocName.value = name
        document.name = name
        await document.reload()
        open.value = true
    } catch (error) {
        message.error({ content: error.message, duration: 1 })
    }
}

const handleSave = async () => {
    try {
        await document.save()
        message.success('Амжилттай хадгаллаа')
        open.value = false
        listRequest.reload()
    } catch (error) {
        message.error({ content: error.message, duration: 1 })
    }
}

const handleCancel = () => {
    open.value = false
}

const handleDelete = async () => {
    try {
        await document.delete()
        message.success('Амжилттай устгалаа')
        open.value = false
        listRequest.reload()
    } catch (error) {
        message.error({ content: error.message, duration: 1 })
    }
}

const listRequest = createListResource({
    doctype: props.doctype,
    filters: props.filters,
    fields: ['name', ...props.meta.listFields.map(f => f.fieldname)],
    pageLength: props.pageLength,
    auto: true,
    orderBy: 'creation desc',
});

const total = createResource({
    url: 'frappe.client.get_count',
    params: {
        doctype: props.doctype,
        filters: props.filters
    },
    auto: true
});

const columns = computed(() => {
    const baseColumns = props.meta.listFields.map(field => ({
        title: field.label,
        dataIndex: field.fieldname,
        key: field.fieldname,
        badge: field.badge,
        link: field.link,
        avatar: field.avatar,
    }));

    if (props.hasAction) {
        baseColumns.push({
            title: 'Үйлдэл',
            key: 'Action',
            width: 70,
            dataIndex: 'name'
        });
    }

    return baseColumns;
});




watch(() => props.doctype, (newDoctype) => {
    listRequest.setDoctype(newDoctype);
    total.setParams({ doctype: newDoctype, filters: props.filters });
    listRequest.reload();
    total.reload();
});

watch(() => props.filters, (newFilters) => {
    listRequest.setFilters(newFilters);
    total.setParams({ doctype: props.doctype, filters: newFilters });
    listRequest.reload();
    total.reload();
}, { deep: true });

watch(() => props.pageLength, (newLength) => {
    listRequest.setPageLength(newLength);
    listRequest.reload();
});
</script>