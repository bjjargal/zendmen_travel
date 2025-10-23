import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const EmployeeStore = defineStore('EmployeeStore', () => {
    const employees = createListResource({
        doctype: 'Employee',
        cache: "EmployeeCache",
        fields: ['name', 'first_name', 'last_name', 'phone', 'email', 'image', 'user'],
        auto: true,
        pageLength: 999,
    });
    return { employees }
});