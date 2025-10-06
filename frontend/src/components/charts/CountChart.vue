<template>

    <a-card title="Хэлтэс">
        <span class=" font-bold text-3xl ">4</span>
        <div class="max-h-56 overflow-y-auto  hide-scrollbar [scrollbar-width:none]  ">
            <div v-for="value in 5" class="">
                <div class="w-full flex justify-between mt-2">
                    <div>department</div>
                    <div>4</div>
                </div>
                <a-progress :show-info="false" :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',

                }" :percent="4 / 5 * 100" />
            </div>
        </div>

    </a-card>
</template>
