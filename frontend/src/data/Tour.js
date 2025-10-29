import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const tourStore = defineStore('TourStore', () => {



    const tours = createListResource({
        doctype: 'Tour',
        cache: "ToursCache",
        fields: ["name", "tour_name", "duration", "image", 'min_people', 'max_people'],
        auto: true,
        // transform(data) {
        //     for (let d of data) {
        //         d.name = d.name
        //     }
        //     return data
        // },
        pageLength: 999,
    });
    return { tours }
});