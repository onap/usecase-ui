// route table

const MENU_ITEM = [
    {
        name: '0', // Angular
        title: 'Home',
        children: [],
        path: '/home',
        source: 'Angular'
    },
    {
        name: '1', // Angular
        title: 'Customer',
        children: [],
        path: '/management',
        source: 'Angular'
    },
    {
        name: '2', // Angular
        title: 'Services',
        children: [
            {
                name: '2-0',
                title: 'Lifecycle Management',
                path: '/services/services-list',
                source: 'Angular'
            }, 
            {
                name: '2-1',
                title: 'SOTN Eline',
                path: '/services/sotn-management',
                source: 'Angular'
            }, 
            {
                name: '2-2',
                title: '5G Sclicing Management',
                path: '/services/slicing-management',
                source: 'Angular'
            }, 
        ]
    },
    {
        name: '3', // Angular
        title: 'Package Managemeny',
        children: [],
        path: '/onboard-vnf-vm',
        source: 'Angular'
    },
    {
        name: '4', // Angular
        title: 'Network Topology',
        children: [
            {
                name: '4-0',
                title: 'CCVPN network',
                path: '/network/ccvpn-network',
                source: 'Angular'
            },
            {
                name: '4-1',
                title: 'MDONS Network',
                path: '/network/mdons-network',
                source: 'Angular'
            }
        ]
    },
    {
        name: '5', // Angular
        title: 'Monitor',
        children: [
            {
                name: '5-0',
                title: '5G Slicing',
                path: '/fcaps/5gslicing',
                source: 'Angular'
            }
        ]
    },
    {
        name: '6', // Vue
        title: 'Test',
        children: [],
        path: '/test',
        source: 'Vue'
    }
]

export default {
    MENU_ITEM
}