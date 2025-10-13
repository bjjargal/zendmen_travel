<template>
    <a-page-header class="!p-0 !mb-2" title="Guide" >
        <template #extra>
            <a-button type="primary">Create tour</a-button>
        </template>
    </a-page-header>
    <div class="grid grid-cols-4">
        <a-card v-for="tour in tours.data" hoverable @click="router.push({ name: 'Tour', params: { name: tour.name } })">
            <template #cover>
                <img class="h-80" alt="image" :src="tour.image" />
            </template>

            <a-card-meta :title="tour.tour_name">
                <template #description>
                    <a-tag color="blue">{{ tour.category }}</a-tag>
                    <a-tag color="orange">{{ tour.duration }} days</a-tag>

                </template>
            </a-card-meta>

        </a-card>

    </div>

    <a-modal v-model:open="open" title="Basic Modal" @ok="">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </a-modal>
</template>
<script setup>
import { createListResource } from 'frappe-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const open = ref(false)

const tours = createListResource({
    doctype: 'Tour',
    fields: ['name', 'tour_name', 'image', 'duration', 'category'],
    auto: true
})



</script>