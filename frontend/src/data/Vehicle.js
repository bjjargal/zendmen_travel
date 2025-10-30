import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const vehicleStore = defineStore('VehicleStore', () => {
    const vehicles = createListResource({
        doctype: 'Vehicle',
        cache: "VehicleCache",
        fields: ['name', 'vehicle_name', 'seats', 'consumption', 'price', 'fuel_cost', 'description'],
        auto: true,
        pageLength: 999,
    });
    return { vehicles }
});