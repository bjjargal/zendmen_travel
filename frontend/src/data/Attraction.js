import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const AttractionsStore = defineStore('AttractionsStore', () => {
    const attractions = createListResource({
        doctype: 'Attraction',
        cache: "AttractionsCache",
        fields: ['name', 'attraction_name','type','destination'],
        auto: true,
        pageLength: 999,
    });

    return { attractions }
});