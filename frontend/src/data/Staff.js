import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const staffStore = defineStore('StaffStore', () => {
    const staffs = createListResource({
        doctype: 'Staff',
        cache: "staffCache",
        fields: ["name", "full_name", "type", "price", 'image', 'email', 'phone_number'],
        auto: true,
        pageLength: 999,
    });
    return { staffs }
});