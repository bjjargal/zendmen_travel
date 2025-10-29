<template>
    <a-page-header class="!p-0 !mb-2" title="Quotation">
        <template #extra>
            <a-button @click="quotations.reload()" :loading="quotations.list.loading"
                class="!flex justify-center items-center">
                <template #icon>
                    <FeatherIcon name="refresh-ccw" class="size-4" />
                </template>
            </a-button>
            <a-button type="primary" @click="open = true">Create quotation</a-button>
        </template>
    </a-page-header>
    <div class="overflow-x-auto">
        <a-table :columns="columns" :data-source="quotations.data" size="small" :loading="quotations.list.loading"
            :customRow="onRow" :pagination="false" row-key="name" :scroll="{ x: 800, y: 'calc(100vh - 280px)' }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'tour'">
                    {{tourOptions.find(item => item.value == record.tour)?.label || record.tour}}
                </template>
            </template>
        </a-table>
    </div>
    <a-modal v-model:open="open" title="New quotation" okText='Create' @ok="handleCreate">
        <a-form :model="newQuotation" layout="vertical">
            <a-form-item label="Tour" name="tour">
                <a-select v-model:value="newQuotation.tour" :options="tourOptions" />
            </a-form-item>
            <a-form-item label="Duration" name="duration">
                <a-input-number v-model:value="newQuotation.duration" addon-after="Days"
                    class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Min people" name="min_people">
                <a-input-number v-model:value="newQuotation.min_people" addon-after="people"
                    class="!w-full"></a-input-number>
            </a-form-item>
            <a-form-item label="Max people" name="max_people">
                <a-input-number v-model:value="newQuotation.max_people" addon-after="people"
                    class="!w-full"></a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>

</template>


<script setup>
import { createListResource } from 'frappe-ui';
import { message } from 'ant-design-vue';
import { ref, reactive, computed, watch } from 'vue';
import { tourStore } from '@/data/Tour';
import { useRouter } from 'vue-router';

const router = useRouter()
const { tours } = tourStore()

const tourOptions = computed(() => tours?.data.map((item) => ({
    label: item.tour_name,
    value: item.name
})))


const quotations = createListResource({
    doctype: 'Quotation',
    fields: ['name', 'tour', 'duration', 'min_people', 'max_people'],
    auto: true,
    pageLength: 20,
})


const open = ref(false)
const newQuotation = reactive({
    tour: '',
    duration: 1,
    min_people: 0,
    max_people: 0
})

watch(
  () => newQuotation.tour,
  (newValue) => {
    const tour = tours?.data?.find((n) => n.name === newValue)
    if (tour) {
      newQuotation.duration = tour.duration
      newQuotation.min_people = tour.min_people
      newQuotation.max_people = tour.max_people
    } else {
      newQuotation.duration = 1
      newQuotation.min_people = 0
      newQuotation.max_people = 0
    }
  }
)


const onRow = (record) => ({
    onClick: () => {
        router.push({ name: 'quotation', params: { name: record.name } })
    }
})



const handleCreate = async () => {
    try {
        await quotations.insert.submit(newQuotation)
        message.success('Successfully created new quotation')
        Object.assign(newQuotation, {
            tour: '',
            duration: 1,
            min_people: 0,
            max_people: 0
        })
        open.value = false
    } catch (error) {
        message.error(error.message, 2)
        open.value = false
    }
}

const columns = [
    {
        title: 'Tour',
        key: 'tour',
        dataIndex: 'tour',
    },
    {
        title: 'Duration',
        key: 'duration',
        dataIndex: 'duration',
    },
    {
        title: 'Min people',
        key: 'min_people',
        dataIndex: 'min_people',
    },
    {
        title: 'Max People',
        key: 'max_people',
        dataIndex: 'max_people',
    },
]
</script>