import { defineStore } from 'pinia'
import { createListResource } from 'frappe-ui'

export const UserStore = defineStore('UserStore', () => {
    const users = createListResource({
        doctype: 'User',
        cache: "UserCache",
        fields: ['name', 'first_name', 'last_name', 'email','image'],
        filters: {
            name: ['not in', ['Administrator', 'Guest']]
        },
        auto: true,
        pageLength: 999,
    });
    return { users }
});