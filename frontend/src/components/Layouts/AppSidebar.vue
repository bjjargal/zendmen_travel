<template>
	<div>
		<div class="lg:hidden fixed top-4 left-4 pl-3 z-50">
			<a-button type="text" @click="menuOpen = true">
				<template #icon>
					<img
						src="@/assets/images/ZendmenMenu.svg"
						alt="menu"
						class="w-6 h-10 object-contain"
					/>
				</template>
			</a-button>
		</div>

		<a-layout-sider
			breakpoint="lg"
			collapsed-width="0"
			class="!bg-[#111727] flex flex-col !overflow-y-auto h-full"
			width="300"
			v-model:collapsed="collapsed"
		>
			<div class="p-4 text-white text-3xl font-bold text-center">
				<img src="@/assets/images/zlogo.png" alt="" />
			</div>

			<div class="flex-1 pr-5 overflow-y-auto hide-scrollbar">
				<div v-for="view in allViews" :key="view.label">
					<Section
						:label="view.name"
						:hideLabel="view.hideLabel"
						:isOpened="view.opened"
					>
						<nav class="flex flex-col">
							<SidebarLink
								v-for="link in view.views"
								:key="link.label"
								:label="link.label"
								:to="link.to"
								:icon="link.icon"
								:child="link.child || []"
								class="mx-2 my-0.5"
							/>
						</nav>
					</Section>
				</div>
			</div>
		</a-layout-sider>

		<!-- 📱 Mobile Drawer -->
		<a-drawer
			v-model:open="menuOpen"
			placement="left"
			width="260"
			:closable="true"
			class="!bg-[#111727]"
		>
			<div class="p-4 text-white text-2xl font-bold text-center border-b border-gray-700">
				<img src="@/assets/images/zlogo.png" alt="Logo" class="mx-auto w-24" />
			</div>

			<div class="flex-1 pr-4 overflow-y-auto hide-scrollbar mt-2">
				<div v-for="view in allViews" :key="view.label">
					<Section
						:label="view.name"
						:hideLabel="view.hideLabel"
						:isOpened="view.opened"
					>
						<nav class="flex flex-col">
							<SidebarLink
								v-for="link in view.views"
								:key="link.label"
								:label="link.label"
								:to="link.to"
								:icon="link.icon"
								:child="link.child || []"
								class="mx-2 my-0.5"
								@click="menuOpen = false"
							/>
						</nav>
					</Section>
				</div>
			</div>
		</a-drawer>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { MenuOutlined } from "@ant-design/icons-vue";
import Section from "@/components/Section.vue";
import SidebarLink from "../SidebarLink.vue";
import useAllViews from "@/components/Layouts/sidebarViews";

const allViews = useAllViews();
const collapsed = ref(false);
const menuOpen = ref(false);
</script>

<style scoped>
.hide-scrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
	display: none;
}
</style>
