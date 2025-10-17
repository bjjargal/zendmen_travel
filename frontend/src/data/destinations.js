import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'
import { ref } from 'vue';

export const DestinationStore = defineStore('destinationStore', () => {
    var destinationOptions = [];

    const destinations = createListResource({
        doctype: 'Destination',
        cache: "destinationsCache",
        fields: ['name', 'destination_name', 'image', 'description'],
        auto: true,
        pageLength: 999,
        onSuccess(data) {
            destinationOptions.value = data.map(d => ({
                value: d.name,
                label: d.destination_name
            }));
        }
    });

    return { destinations, destinationOptions }
});