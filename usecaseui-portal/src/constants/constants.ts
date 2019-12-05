export const TASK_PROCESSING_STATUS = [
	{
		title: '规划阶段',
		value: 'Planning'
	},
	{
		title: '审核阶段',
		value: 'Waiting to Confirm'
	},
	{
		title: '切片创建中',
		value: 'Creating'
	},
	{
		title: '创建完成',
		value: 'Completed'
	}
]

export const BUSINESS_REQUIREMENT = [
	[
		{
			title: '切片业务名称',
			key: 'service_name'
		},
		{
			title: 'S-NSSAI',
			key: 'service_snssai'
		},
		{
			title: '用户下行带宽（Mbps）',
			key: 'exp_data_rate_dl'
		},
	],
	[
		{
			title: '用户上行带宽（Mbps）',
			key: 'exp_data_rate_ul'
		},
		{
			title: '游牧性',
			key: 'ue_mobility_level'
		},
		{
			title: '时延（ms）',
			key: 'latency'
		},
	],
	[
		{
			title: '使用期限（月）',
			key: 'use_interval'
		},
		
		{
			title: '激活因子（%）',
			key: 'activity_factor'
		},
		{
			title: '共享等级',
			key: 'resource_sharing_level'
		},
	],
	[
		{
			title: '连接规模数',
			key: 'max_number_of_ues'
		},
		{
			title: '上行区域流量密度（Mbps/km ）',
			key: 'area_traffic_cap_ul'
		},
		{
			title: '下行区域流量密度（Mbps/km ）',
			key: 'area_traffic_cap_dl'
		}
	],
	[
		{
			title: '区域',
			key: 'coverage_area_ta_list'
		},
	],
	
	
] 

export const WIRELESS_FORM_ITEMS = [
	{
		title: '时延（ms）',
		key: 'an_latency'
	},
	{
		title: '5QI',
		key: 'an_5qi'
	},
	{
		title: '覆盖小区列表',
		key: 'an_coverage_area_ta_list'
	}
]

export const TRANSFRER_FORM_ITEMS = [
	{
		title: '时延（ms）',
		key: 'tn_latency'
	},
	{
		title: '带宽',
		key: 'tn_bandwidth'
	}
]

export const CORE_FORM_ITEMS = 	[
	{
		title: 'S-NSSAI',
		key: 'cn_service_snssai'
	},
	{
		title: '共享等级',
		key: 'cn_resource_sharing_level',
		options: [
			{
				title: '共享',
				key: 'shared'
			},
			{
				title: '独享',
				key: 'no-shared'
			}
		]
	},
	{
		title: '游牧性',
		key: 'cn_ue_mobility_level',
		options: [
			{
				title: '不可游牧',
				key: 'stageary'
			},
			{
				title: '固定接入',
				key: 'nomadic'
			},
			{
				title: '限定范围内可游牧',
				key: 'spatially restricted mobility'
			},
			{
				title: '自由游牧',
				key: 'fully mobility'
			}
		]
	},
	{
		title: '时延（ms）',
		key: 'cn_latency'
	},
	{
		title: '连接规模数',
		key: 'cn_max_number_of_ues'
	},
	{
		title: '活动因子（%）',
		key: 'cn_activity_factor'
	},
	{
		title: '用户下行体验速率（Mbps）',
		key: 'cn_exp_data_rate_dl'
	},
	{
		title: '用户上行体验速率（Mbps）',
		key: 'cn_exp_data_rate_ul'
	},
	{
		title: '下行区域流量密度（Mbps/km ）',
		key: 'cn_area_traffic_cap_dl'
	},
	{
		title: '下行区域流量密度（Mbps/km ）',
		key: 'cn_area_traffic_cap_ul'
	}
]

export const ADDRESS =  [
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
						
					},
					{
						"id": "1002",
						"name": "西城区",
						
					},
					{
						"id": "1003",
						"name": "昌平区"
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
				},
				{
					"id": "2002",
					"name": "静安区",
					
				}
			]
		}]
	}
]