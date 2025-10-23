<template>
    <div class="flex flex-col h-full  overflow-y-auto">
        <a-page-header class="!p-0 !mb-2" title="Activities">
            <template #extra>
                <a-button @click="oppertunities.reload()" :loading="oppertunities.list.loading"
                    class="!flex justify-center items-center">
                    <template #icon>
                        <FeatherIcon name="refresh-ccw" class="size-4" />
                    </template>
                </a-button>
                <!-- <a-button type="primary" @click="">Create activity</a-button> -->
            </template>
        </a-page-header>
        <div class="flex-1 h-full bg-white p-4 rounded">
            <a-tabs v-model:activeKey="currentTab" tab-position="top" type="card">
                <a-tab-pane v-for="tab in statusOptions" :key="tab.value" :tab="tab.value">
                    <a-table :columns="columns" :data-source="oppertunities.data" :loading="oppertunities.list.loading"
                        :customRow="onRow" size="small" :pagination="false" row-key="name"
                        :scroll="{ y: 'calc(100vh - 280px)' }">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'status'">
                                <a-tag :color="statusOptions.find(item => item.value === record.status)?.color">
                                    {{ record.status }}
                                </a-tag>
                            </template>
                        </template>
                    </a-table>
                    <a-button class="mt-2" @click="oppertunities.next()">load more</a-button>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>

</template>


<script setup>
import { ref, watch } from 'vue';
import { createListResource } from 'frappe-ui';
import { useRouter } from 'vue-router';

const router = useRouter()

const currentTab = ref('New')

const oppertunities = createListResource({
    doctype: 'Opportunity',
    fields: ['name', 'customer', 'deadline', 'assigned', 'status'],
    auto: true,
    pageLength: 20,
    filters: {
        status: currentTab
    },
})

watch(currentTab, () => {
    oppertunities.reload()
})


const onRow = (record) => ({
    onClick: () => {
        router.push({ name: 'oppertunity', params: { name: record.name } })
    }
})

const statusOptions = [
    {
        value: 'New',
        color: 'green'
    },
    {
        value: 'Responded',
        color: 'orange'
    },
    {
        value: 'Closed',
        color: 'purple'
    }
]

const columns = [
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status'
    },
    {
        title: 'Customer',
        key: 'customer',
        dataIndex: 'customer'
    },
    {
        title: 'Deadline',
        key: 'deadline',
        dataIndex: 'deadline'
    },
    {
        title: 'assigned',
        key: 'assigned',
        dataIndex: 'assigned'
    },
]

</script>