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
	}
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