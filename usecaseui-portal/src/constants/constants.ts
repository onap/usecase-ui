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
	{
		title: '用户上行带宽（Mbps）',
		key: 'exp_data_rate_u'
	},
	{
		title: '游牧性',
		key: 'ue_mobility_level'
	},
	{
		title: '时延（ms）',
		key: 'latency'
	},
	{
		title: '使用期限（月）',
		key: 'use_interval'
	},
	{
		title: '区域',
		key: 'coverage_area_ta_list'
	},
	{
		title: '激活因子（%）',
		key: 'activity_factor'
	},
	{
		title: '共享等级',
		key: 'resource_sharing_level'
	},
	{
		title: '上行区域流量密度（Mbps/km ）',
		key: 'area_traffic_cap_ul'
	},
	{
		title: '连接规模数',
		key: 'max_number_of_ues'
	},
	{
		title: '下行区域流量密度（Mbps/km ）',
		key: 'area_traffic_cap_dl'
	}
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
		key: 'cn_resource_sharing_level'
	},
	{
		title: '游牧性',
		key: 'cn_ue_mobility_level'
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