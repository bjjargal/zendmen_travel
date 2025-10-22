import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const EmployeeStore = defineStore('EmployeeStore', () => {
    const emplyees = createListResource({
        doctype: 'Employee',
        cache: "EmployeeCache",
        fields: ['name', 'first_name', 'last_name','phone'],
        auto: true,
        pageLength: 999,
    });
    return { emplyees }
});