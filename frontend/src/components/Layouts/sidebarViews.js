import { computed } from 'vue'
import { sessionStore } from '@/data/session'
import { storeToRefs } from 'pinia'

const links = [
    {
        label: 'Хянах самбар',
        icon: 'home',
        to: 'Home',
    },
    {
        label: 'Tour',
        icon: 'map',
        to: 'TourList',
    },
    {
        label: 'Lead',
        icon: 'sliders',
        to: 'LeadList',
    },
    {
        label: 'Oppertunity',
        icon: 'package',
        to: 'oppertunityList',
    },
    {
        label: 'Quotation',
        icon: 'dollar-sign',
        to: 'quotationList',
    },
    {
        label: 'Contacts',
        icon: 'phone-call',
        to: 'contactList',
    },
    {
        label: 'Employees',
        icon: 'users',
        to: 'employeeList',
    },
    {
        label: 'Staff',
        icon: 'user',
        to: 'staff',
    },
    {
        label: 'Accomodation',
        icon: 'home',
        to: 'accomodationList',
    },
    {
        label: 'Activity',
        icon: 'activity',
        to: 'ActivityList',
    },
    {
        label: 'Destination',
        icon: 'map',
        to: 'DestinationList',
    },
    {
        label: 'Vehicle',
        icon: 'navigation-2',
        to: 'VehicleList',
    },

]

function hasAccess(link, roles) {
    if (!link.roles) return true
    return link.roles.some(role => roles.value.includes(role))
}

export default function useAllViews() {
    const session = sessionStore()
    const { roles } = storeToRefs(session)

    const allViews = computed(() => [
        {
            name: 'All Views',
            hideLabel: true,
            opened: true,
            views: links
                .filter(link => hasAccess(link, roles))
                .map(link => ({
                    ...link,
                    child: link.child
                        ? link.child.filter(childLink => hasAccess(childLink, roles))
                        : []
                })),
        }
    ])

    return allViews
}
