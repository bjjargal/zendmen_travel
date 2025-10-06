<template>
    <a-layout-header class="!bg-white !border-b overflow-hidden  !px-8 !h-20 flex justify-between items-center">
        <div></div>
        <div class="flex gap-4 items-center">
            <div>
                <Notifications />
            </div>
            <div>
                <UserDropdown />
            </div>
        </div>
    </a-layout-header>
</template>
<script setup>
import UserDropdown from '@/components/UserDropdown.vue';
import Notifications from '@/components/Notifications.vue';
</script>