export const COMMUNICATION_FORM_ITEMS = [
    /***
        title: MARK THE ITEM NAME,
        key:  MARK THE ITEM KEY,
        type: MARKE THE ITEM TYPE, CAN BE ADDED IF NECESSARY: input/select/radio/city-select
        required: IF REQUIRED, 
        scoped: IF SCOPED NUMBERS, CAN BE EMITTED IF NOT
        placeholder: IF PLACEHOLDER, CAN BE EMITTED IF NOT
        options: IF ITEM NEEDS OPTIONS, CAN BE EMITTED IF NOT
    ***/
    {
        title: 'Communication Service Name',
        key: 'name',
        type:"input",
        required:true 

    },
    {
        title: 'Max Number of UEs',
        key: 'maxNumberofUEs',
        type:"input",
        scoped:true, 
        required:true
    },
    {
        title: 'Data Rate Downlink (Mbps)',
        key: 'expDataRateDL',
        type:"input",
        scoped:true,
        required:true
    },
    {
        title: 'Latency',
        key: 'latency',
        type:"input",
        scoped:true,
        required:true
    },
    {
        title: 'Data Rate Uplink (Mbps)',
        key: 'expDataRateUL',
        type:"input",
        scoped:true,
        required:true
    },
    {
        title: 'Resource Sharing Level',
        key: 'resourceSharingLevel',
        type:"radio",
        required:true
        options: [
            {
                title: 'Shared',
                key: 'shared'
            },
            {
                title: 'Non-shared',
                key: 'non-shared'
            }
        ]
    },
    {
        title: 'Mobility',
        key: 'uEMobilityLevel',
        type:"select",
        required:true
        options: [
            {
                title: 'Stationary',
                key: 'stationary'
            },
            {
                title: 'Nomadic',
                key: 'nomadic'
            },
            {
                title: 'Spatially Restricted Mobility',
                key: 'spatially restricted mobility'
            },
            {
                title: 'Fully Mobility',
                key: 'fully mobility'
            }
        ]
    },
    {
        title: 'Area',
        key: 'coverageArea',
        type:"city-select",
        required:true
    },
    {
        title: 'Coverage Area Number',
        key: 'coverageAreaNumber',
        type:"input",
        placeholder:"Please enter the coverage area number. use , to separate them if necessary"
        required:false
    }
]

export const COMMUNICATION_FORM_ADDRESS = [
    {
        "id": "1",
        "name": "Beijing",
        "city": [
            {
                "id": "101",
                "name": "Beijing",
                "county": [
                    {
                        "id": "1001",
                        "name": "Haiding District",
                        "street": [
                            {
                                "id": "100101",
                                "name": "Wanshoulu Street"
                            },
                            {
                                "id": "100102",
                                "name": "Zhongguancun Street"
                            },
                            {
                                "id": "100103",
                                "name": "Haidian Street"
                            },
                            {
                                "id": "100104",
                                "name": "Xisanqi Street"
                            }
                        ]
                    },
                    {
                        "id": "1002",
                        "name": "Xicheng District",
                        "street": [
                            {
                                "id": "100201",
                                "name": "Guang'anmenwai Street"
                            },
                            {
                                "id": "100202",
                                "name": "Xuanwumen Street"
                            },
                            {
                                "id": "100203",
                                "name": "West Changan Street"
                            },
                            {
                                "id": "100204",
                                "name": "Financial Street"
                            }
                        ]
                    },
                    {
                        "id": "1003",
                        "name": "Changping District",
                        "street": [
                            {
                                "id": "100301",
                                "name": "Chengbei Street"
                            },
                            {
                                "id": "100302",
                                "name": "Chengnan Street"
                            },
                            {
                                "id": "100303",
                                "name": "Tiantongyuan North Street"
                            },
                            {
                                "id": "100304",
                                "name": "Tiantongyuan South Street"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "2",
        "name": "Shanghai",
        "city": [{
            "id": "201",
            "name": "Shanghai City",
            "county": [{
                "id": "2001",
                "name": "udongxin District",
                "street": [
                    {
                        "id": "200101",
                        "name": "Lujiazui Street"
                    },
                    {
                        "id": "200102",
                        "name": "Zhoujiadu Street"
                    },
                    {
                        "id": "200103",
                        "name": "Tangqiao Street"
                    },
                    {
                        "id": "200104",
                        "name": "Nanquanlu Street"
                    }
                ]
            },
                {
                    "id": "2002",
                    "name": "Jingan District",
                    "street": [
                        {
                            "id": "200201",
                            "name": "Jiangning Lu Street"
                        },
                        {
                            "id": "200202",
                            "name": "Jing'an Temple Street"
                        },
                        {
                            "id": "200203",
                            "name": "Nanjing West Road Street"
                        }
                    ]
                }
            ]
        }]
    }
]