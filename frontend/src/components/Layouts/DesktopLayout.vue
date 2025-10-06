<template>
    <a-layout class="h-screen flex">
        <AppSidebar class="h-screen sticky top-0" />
        <a-layout class="flex-1 flex flex-col">
            <AppHeader />
            <a-layout-content class="pt-4 px-8 flex-1 overflow-y-auto">
                <slot />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import AppSidebar from '@/components/Layouts/AppSidebar.vue';
import AppHeader from '@/components/Layouts/AppHeader.vue';
</script>