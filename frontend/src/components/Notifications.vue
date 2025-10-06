<template>
    <a-dropdown :trigger="['click']" class="">
        <a-button size="large" class="!flex rounded items-center gap-2 !py-6  ">
            <FeatherIcon name="bell" class="size-7" />
            Мэдэгдэл
        </a-button>
    </a-dropdown>
</template>
<script setup>
import { FeatherIcon } from 'frappe-ui'
</script>