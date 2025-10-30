import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'
import { ref } from 'vue';
export const AccommodationsStore = defineStore('AccommodationStore', () => {
    const accomodations = createListResource({
        doctype: 'Accomodation',
        fields: ['name', 'accomodation_name',
            'lux_price', 'single_supplement', 'standard_price',
            'staff_price', 'tourist_b', 'tourist_l', 'tourist_d',
            'staff_b', 'staff_l', 'staff_d', 'type', 'destination', 'description'],
        cache: 'AccomodationsCache',
        auto: true,
        pageLength: 999,

    })
    return { accomodations }
})