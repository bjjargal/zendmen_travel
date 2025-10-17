import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'

export const ActivityDesStore = defineStore('ActivitydesStore', () => {
    const activitiesDes = createResource({
        url: 'zendmen_travel.api.get_destination_activities',
        cache: 'ActivityDesCache',
        auto: true,
    })
    return { activitiesDes }
})