import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'
import { computed } from 'vue';

export const AccommodationStore = defineStore('accommodation', () => {
    const accommodation = createResource({
        method: 'GET',
        url: 'zendmen_travel.api.get_accommodation',  
        cache: "accommodations",
        auto: true,
        transform(data) {
            return data.map(d => ({
                label: d.accommodation_name,  
                value: d.name
            }))
        },
        onError(error) {
            console.error('Accommodation resource error:', error);
            if (error && error.exc_type === 'AuthenticationError') {
            }
        },
    });

    const accommodations = computed(() => {
        return accommodation.data?.value || [];
    });

    return { accommodations }
});