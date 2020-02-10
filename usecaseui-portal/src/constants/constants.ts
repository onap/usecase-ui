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
	[
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
	],
	[
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
	],
	[
		{
			title: 'Use Interval (Moon) ',
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
	],
	[
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
		}
	],
	[
		{
			title: 'Area',
			key: 'area'
		},
	],


]

export const WIRELESS_FORM_ITEMS = [
	{
		title: 'Latency (ms)',
		key: 'an_latency'
	},
	{
		title: '5QI',
		key: 'an_5qi'
	},
    {
        title: 'Script Name',
        key: 'an_script_name'
    },
	{
		title: 'Coverage Area Ta List',
		key: 'an_coverage_area_ta_list'
	}
]

export const TRANSFRER_FORM_ITEMS = [
	{
		title: 'Latency (ms)',
		key: 'tn_latency'
	},
	{
		title: 'Bandwidth',
		key: 'tn_bandwidth'
	},
    {
        title: 'Script Name',
        key: 'tn_script_name'
    },
]

export const CORE_FORM_ITEMS = [
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
				key: 'no-shared'
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
    }
]

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
export const BUSINESS_STATUS = [
	"All", "activated", "deactivated"
]

export const COMMUNICATION_FORM_ITEMS = [
    {
        title: 'Slicing Business Name',
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
                key: 'no-shared'
            }
        ]
    },
    {
        title: 'Mobility',
        key: 'uEMobilityLevel',
    },
    {
        title: 'Use Interval (Month)',
        key: 'useInterval'
    },
    {
        title: 'Max Number of UEs',
        key: 'coverageArea'
    }
]

export const ADDRESS = {
    "result_header": {
        "result_code": 200,
        "result_message": "Successfully"
    },

    "result_body": {
        "province": [
            {
                "id": "1",
                "name": "北京",
                "city": [
                    {
                        "id": "101",
                        "name": "北京市",
                        "county": [
                            {
                                "id": "1001",
                                "name": "海淀区",
                                "street": [
                                    {
                                        "id": "100101",
                                        "name": "万寿路街道"
                                    },
                                    {
                                        "id": "100102",
                                        "name": "中关村街道"
                                    },
                                    {
                                        "id": "100103",
                                        "name": "海淀街道"
                                    },
                                    {
                                        "id": "100104",
                                        "name": "西三旗街道"
                                    }
                                ]
                            },
                            {
                                "id": "1002",
                                "name": "西城区",
                                "street": [
                                    {
                                        "id": "100201",
                                        "name": "广安门内街道"
                                    },
                                    {
                                        "id": "100202",
                                        "name": "广安门外街道"
                                    },
                                    {
                                        "id": "100203",
                                        "name": "西长安街街道"
                                    },
                                    {
                                        "id": "100204",
                                        "name": "金融街街道"
                                    }
                                ]
                            },
                            {
                                "id": "1003",
                                "name": "昌平区",
                                "street": [
                                    {
                                        "id": "100301",
                                        "name": "城北街道"
                                    },
                                    {
                                        "id": "100302",
                                        "name": "城南街道"
                                    },
                                    {
                                        "id": "100303",
                                        "name": "天通苑北街道"
                                    },
                                    {
                                        "id": "100304",
                                        "name": "天通苑南街道"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "id": "2",
                "name": "上海",
                "city": [{
                    "id": "201",
                    "name": "上海市",
                    "county": [{
                        "id": "2001",
                        "name": "浦东新区",
                        "street": [
                            {
                                "id": "200101",
                                "name": "陆家嘴街道"
                            },
                            {
                                "id": "200102",
                                "name": "周家渡街道"
                            },
                            {
                                "id": "200103",
                                "name": "塘桥街道"
                            },
                            {
                                "id": "200104",
                                "name": "南码头路街道"
                            }
                        ]
                    },
                        {
                            "id": "2002",
                            "name": "静安区",
                            "street": [
                                {
                                    "id": "200201",
                                    "name": "江宁路街道"
                                },
                                {
                                    "id": "200202",
                                    "name": "静安寺街道"
                                },
                                {
                                    "id": "200203",
                                    "name": "南京西路街道"
                                },
                                {
                                    "id": "200204",
                                    "name": "曹家渡街道"
                                }
                            ]
                        }
                    ]
                }]
            }
        ]
    }
}