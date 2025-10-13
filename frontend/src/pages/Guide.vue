<template>
    <a-page-header class="!p-0 !mb-2" title="Guide" @back="() => $router.go(-1)">
        <template #extra>
            <a-button type="primary">Create guide</a-button>
        </template>
    </a-page-header>
    <div class="w-full grid sm:grid-cols-1 md:grid-cols-2   lg:grid-cols-4 overflow-y-auto gap-4 flex-1">
        <a-card v-for="guide in guides.data" hoverable
            @click="router.push({ name: 'Employee', params: { name: employee.name } })">
            <template #cover>
                <img class="h-80" alt="image" :src="guide.image" />
            </template>
            <a-card-meta :title="`${guide.last_name} ${guide.first_name}`">
                <template #description>
                    <div class="flex gap-2 items-center text-black">
                        <FeatherIcon name="mail" class="size-4" /> {{ guide.email }}
                    </div>
                    <div class="flex gap-2 items-center text-black">
                        <FeatherIcon name="phone" class="size-4" /> {{ guide?.phone_number || '' }}
                    </div>
                </template>
            </a-card-meta>
        </a-card>
    </div>

</template>
<script setup>
import { createListResource } from 'frappe-ui';

const guides = createListResource({
    doctype: 'Guide',
    fields: ['first_name', 'last_name', 'image', 'email', 'phone_number'],
    auto: true,
    orderBy: 'creation desc',
    pageLength: 20,
    cache: 'Guides',

})

const meta = [
    {
        field_name: 'first_name',
        field_type: 'data'
    },
    {
        field_name: 'last_name',
        field_type: 'data'
    },
    {
        field_name: 'email',
        field_type: 'data'
    },
    {
        field_name: 'phone_number',
        field_type: 'data'
    },
]


console.log(guides)
</script>