import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'
import { ref } from 'vue';
export const ActivityStore = defineStore('ActivityStore', () => {
    const activities = createListResource({
        doctype: 'Activity',
        fields: ['name', 'activity_name', 'cost'],
        cache: 'ActivityCache',
        auto: true,
        pageLength: 999,

    })
    return { activities }
})