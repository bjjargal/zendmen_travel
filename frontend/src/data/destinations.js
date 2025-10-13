import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'
import { ref } from 'vue';

// In DestinationStore (stores/destinations.js or similar)
export const DestinationStore = defineStore('destination', () => {
    const destinations = createResource({
        method: 'GET',
        url: 'zendmen_travel.api.get_destination',
        cache: "destinations",
        auto: true,
        transform(data) {
            return data.map(d => ({
                value: d.name,
                label: d.destination_name
            }))
        }
    });

    return { destinations }
});