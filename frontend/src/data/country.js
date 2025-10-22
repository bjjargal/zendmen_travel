import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const CountryStore = defineStore('CountryStore', () => {
    const countrys = createListResource({
        doctype: 'Country',
        cache: "CountryCache",
        fields: ['name', 'country_name'],
        auto: true,
        pageLength: 999,
    });

    return { countrys }
});