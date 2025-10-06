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
        icon: 'home',
        to: 'Home',
    },
    
]

function hasAccess(link, roles) {
    if (!link.roles) return true
    return link.roles.some(role => roles.value.includes(role))
}

// 👉 computed version that depends on session roles
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
