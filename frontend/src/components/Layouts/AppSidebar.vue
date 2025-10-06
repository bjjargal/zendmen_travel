<template>
    <a-layout-sider class="relative flex-col !overflow-y-auto !bg-[#111727] !flex " width="300">
        <div class="p-4 text-white text-3xl font-bold text-center ">
            OTGO ERP
        </div>
        <div class="flex-1 ! !pr-5 [scrollbar-width:none] [-ms-overflow-style:none] !hide-scrollbar">
            <div v-for="view in allViews" :key="view.label">
                <Section :label="view.name" :hideLabel="view.hideLabel" :isOpened="view.opened">
                    <nav class="flex flex-col ">
                        <SidebarLink v-for="link in view.views" :label="link.label" :to="link.to" :icon="link.icon"
                            :child="link.child ? link.child : []" class="mx-2 my-0.5" />
                    </nav>
                </Section>
            </div>
        </div>
    </a-layout-sider>
</template>

<script setup>
import Section from '@/components/Section.vue';
import SidebarLink from '../SidebarLink.vue';
import useAllViews from '@/components/Layouts/sidebarViews';
const allViews = useAllViews()
</script>

