export const TASK_PROCESSING_STATUS = [
	{
		title: 'All',
		value: 'all'
	},
	{
		title: 'Planning',
		value: 'Planning'
	},
	{
		title: 'WaitingToConfirm',
		value: 'WaitingToConfirm'
	},
	{
		title: 'Creating',
		value: 'Creating'
	},
	{
		title: 'Completed',
		value: 'Completed'
	}
]

export const BUSINESS_REQUIREMENT = [

		{
			title: 'Slicing Business Name',
			key: 'service_name'
		},
		{
			title: 'S-NSSAI',
			key: 'service_snssai'
		},
		{
			title: 'Data Rate Downlink (Mbps) ',
			key: 'exp_data_rate_dl'
		},
		{
			title: 'Data Rate Uplink (Mbps) ',
			key: 'exp_data_rate_ul'
		},
		{
			title: 'Mobility',
			key: 'ue_mobility_level'
		},
		{
			title: 'Latency (ms)',
			key: 'latency'
		},
		{
			title: 'Use Interval (Month) ',
			key: 'use_interval'
		},

		{
			title: 'Activity Factor（%）',
			key: 'activity_factor'
		},
		{
			title: 'Resource Sharing Level',
			key: 'resource_sharing_level'
		},
		{
			title: 'Max Number of UEs',
			key: 'max_number_of_ues'
		},
		{
			title: 'Uplink Regional Traffic Density（Mbps/km ）',
			key: 'area_traffic_cap_ul'
		},
		{
			title: 'Downlink Regional Traffic Density（Mbps/km ）',
			key: 'area_traffic_cap_dl'
		},
		[
            {
                title: 'Area',
                key: 'area'
            }
        ]

]


export const TRANSFRER_FORM_ITEMS = [
    {
        title: 'S-NSSAI',
        key: 'tn_service_snssai'
    },
	{
        title: 'Latency (ms)',
        key: 'tn_latency'
    },
    {
        title: 'Jitter',
        key: 'tn_jitter'
    },
	{
		title: 'MaxBandwidth',
		key: 'tn_bandwidth'
	},
    {
        title: 'Script Name',
        key: 'tn_script_name'
    },
]

export const CORE_FORM_ITEMS = {
    "An": [
        {
            title: 'S-NSSAI',
            key: 'an_service_snssai'
        },
        {
            title: 'Resource Sharing Level',
            key: 'an_resource_sharing_level',
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
            key: 'an_ue_mobility_level',
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
            title: 'Latency (ms)',
            key: 'an_latency'
        },
        {
            title: 'Max Number of UEs',
            key: 'an_max_number_of_ues'
        },
        {
            title: 'Activity Factor (%)',
            key: 'an_activity_factor'
        },
        {
            title: 'User Downlink Experience Rate（Mbps）',
            key: 'an_exp_data_rate_dl'
        },
        {
            title: 'User Uplink Experience Rate（Mbps）',
            key: 'an_exp_data_rate_ul'
        },
        {
            title: 'Downlink Regional Traffic Density（Mbps/km ）',
            key: 'an_area_traffic_cap_dl'
        },
        {
            title: 'Uplink Regional Traffic Density（Mbps/km ）',
            key: 'an_area_traffic_cap_ul'
        },
        {
            title: 'Script Name',
            key: 'an_script_name'
        },
        {
            title: 'overallUserDensity',
            key: 'an_overalluser_density'
        },
        {
            title:'Endpoint',
            key:"an_Endpoint",
            options: [
                {
                    title: 'ip_address',
                    key: 'an_ip_address',
                    holder: 'IpAddress'
                },
                {
                    title: 'logical_link',
                    key: 'an_logical_link',
                    holder: 'LogicId'
                },
                {
                    title: 'nexthop_info',
                    key: 'an_nexthop_info'
                }
            ]
        },
        {
            title: 'Coverage Area Ta List',
            key: 'an_coverage_area_ta_list'
        }
    ],
    "Cn": [
        {
            title: 'S-NSSAI',
            key: 'cn_service_snssai'
        },
        {
            title: 'Resource Sharing Level',
            key: 'cn_resource_sharing_level',
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
            key: 'cn_ue_mobility_level',
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
            title: 'Latency (ms)',
            key: 'cn_latency'
        },
        {
            title: 'Max Number of UEs',
            key: 'cn_max_number_of_ues'
        },
        {
            title: 'Activity Factor (%)',
            key: 'cn_activity_factor'
        },
        {
            title: 'User Downlink Experience Rate（Mbps）',
            key: 'cn_exp_data_rate_dl'
        },
        {
            title: 'User Uplink Experience Rate（Mbps）',
            key: 'cn_exp_data_rate_ul'
        },
        {
            title: 'Downlink Regional Traffic Density（Mbps/km ）',
            key: 'cn_area_traffic_cap_dl'
        },
        {
            title: 'Uplink Regional Traffic Density（Mbps/km ）',
            key: 'cn_area_traffic_cap_ul'
        },
        {
            title: 'Script Name',
            key: 'cn_script_name'
        },
        {
            title: 'overallUserDensity',
            key: 'cn_overalluser_density'
        },
        {
            title:'Endpoint',
            key:"cn_Endpoint",
            options: [
                {
                    title: 'ip_address',
                    key: 'cn_ip_address',
                    holder: 'IpAddress'
                },
                {
                    title: 'logical_link',
                    key: 'cn_logical_link',
                    holder: 'LogicId'
                },
                {
                    title: 'nexthop_info',
                    key: 'cn_nexthop_info'
                }
            ]
        },
    ]
}

export const ADDRESS = [
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
					},
					{
						"id": "1002",
						"name": "Xicheng District",
					},
					{
						"id": "1003",
						"name": "Changping District"
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
			"county": [
				{
					"id": "2001",
					"name": "Pudongxin District",
				},
				{
					"id": "2002",
					"name": "Jingan District"
				}
			]
		}]
	}
]

export const NexthopInfo_Options = [
    {
        title:"test_info_01",
        key:"test_info_01"
    },
    {
        title:"test_info_02",
        key:"test_info_02"
    },
    {
        title:"test_info_03",
        key:"test_info_03"
    }
]

export const BUSINESS_STATUS = [
	"All", "Activated", "Deactivated"
]

export const COMMUNICATION_FORM_ITEMS = [
    {
        title: 'Communication Service Name',
        key: 'name'
    },
    {
        title: 'Max Number of UEs',
        key: 'maxNumberofUEs'
    },
    {
        title: 'Data Rate Downlink (Mbps)',
        key: 'expDataRateDL'
    },
    {
        title: 'Latency',
        key: 'latency'
    },
    {
        title: 'Data Rate Uplink (Mbps)',
        key: 'expDataRateUL'
    },
    {
        title: 'Resource Sharing Level',
        key: 'resourceSharingLevel',
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
        key: 'coverageArea'
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