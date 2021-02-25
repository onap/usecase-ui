/*******
    title /MUST/: MARK THE ITEM NAME,
    key /MUST/:  MARK THE ITEM KEY,
    type /MUST/: MARKE THE ITEM TYPE, CAN BE ADDED IF NECESSARY: input/select/radio/city-select/select/table-radio/endpoint
    required /MUST/: IF REQUIRED, 
    disable /MUST/: IF DISABLED,
    placeholder: IF PLACEHOLDER, CAN BE EMITTED IF NOT
    options: IF ITEM NEEDS OPTIONS, CAN BE EMITTED IF NOT
********/

// Tn
export const TRANSFRER_FORM_ITEMS = [
	{
		title: "S-NSSAI",
		key: "sliceProfile_TN_BH_sNSSAI",
		required: true,
		type: "input",
		disable: true,
	},
	{
		title: "Latency (ms)",
		key: "tn_bh_latency",
		required: true,
		type: "input",
		disable: false,
	},
	{
		title: "Jitter",
		key: "sliceProfile_TN_BH_jitte",
		required: false,
		type: "input",
		disable: false,
	},
	{
		title: "MaxBandwidth",
		key: "tn_bh_bandwidth",
		required: true,
		type: "input",
		disable: false,
	},
	{
		title: "Resource Sharing Level", // select
		key: "sliceProfile_TN_resourceSharingLevel", // :new
		required: true,
		disable: true,
		type: "radio",
		options: [
			{
				title: "Shared",
				key: "shared",
			},
			{
				title: "Non-shared",
				key: "non-shared",
			},
		],
	},
	{
		title: "Connection Links", // table
		key: "sliceProfile_TN_connection_links", // :new
		required: false, // combined
		type: "table-radio",
		disable: false,
	},
	{
		title: "AN Endpoint", // input group
		key: "an_Endpoint",
		type: "endpoint",
		required: false,
		disable: false,
		options: [
			{
				title: "ip_address",
				key: "sliceProfile_AN_ipAddress",
				holder: "IpAddress",
			},
			{
				title: "logical_link",
				key: "sliceProfile_AN_logicInterfaceId",
				holder: "LogicId",
			},
			{
				title: "nexthop_info",
				key: "sliceProfile_AN_nextHopInfo",
				holder: "NextHop",
			},
		],
	},
	{
		title: "CN Endpoint",
		key: "cn_Endpoint",
		type: "endpoint",
		required: false,
		disable: false,
		options: [
			{
				title: "ip_address",
				key: "sliceProfile_CN_ipAddress",
				holder: "IpAddress",
			},
			{
				title: "logical_link",
				key: "sliceProfile_CN_logicInterfaceId",
				holder: "LogicId",
			},
			{
				title: "nexthop_info",
				key: "sliceProfile_CN_nextHopInfo",
				holder: "NextHop",
			},
		],
	},
];

// An and Cn
export const CORE_FORM_ITEMS = {
	An: [
		{
			title: "S-NSSAI",
			key: "sliceProfile_AN_sNSSAI",
			required: true,
			type: "input",
			disable: "true",
		},
		{
			title: "Resource Sharing Level",
			key: "sliceProfile_AN_resourceSharingLevel",
			required: true,
			type: "radio",
			disable: false,
			options: [
				{
					title: "Shared",
					key: "shared",
				},
				{
					title: "Non-shared",
					key: "non-shared",
				},
			],
		},
		{
			title: "Mobility",
			key: "sliceProfile_AN_uEMobilityLevel",
			required: true,
			type: "select",
			disable: false,
			options: [
				{
					title: "Stationary",
					key: "stationary",
				},
				{
					title: "Nomadic",
					key: "nomadic",
				},
				{
					title: "Spatially Restricted Mobility",
					key: "spatially restricted mobility",
				},
				{
					title: "Fully Mobility",
					key: "fully mobility",
				},
			],
		},
		{
			title: "Latency (ms)",
			key: "an_latency",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Max Number of PUD Session",
			key: "sliceProfile_AN_maxNumberofPDUSession",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Max Number of UEs",
			key: "sliceProfile_AN_maxNumberofUEs",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Activity Factor (%)",
			key: "sliceProfile_AN_activityFactor",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "User Downlink Experience Rate（Mbps）",
			key: "sliceProfile_AN_expDataRateDL",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "User Uplink Experience Rate（Mbps）",
			key: "sliceProfile_AN_expDataRateUL",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Downlink Regional Traffic Density（Mbps/km ）",
			key: "sliceProfile_AN_areaTrafficCapDL",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Uplink Regional Traffic Density（Mbps/km ）",
			key: "sliceProfile_AN_areaTrafficCapUL",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Script Name",
			key: "an_script_name",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Overall User Density",
			key: "sliceProfile_AN_overallUserDensity",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Coverage Area Ta List",
			key: "an_coverage_area_ta_list",
			required: true,
			type: "city-select",
			disable: false,
		},
	],
	Cn: [
		{
			title: "S-NSSAI",
			key: "cn_service_snssai",
			required: true,
			type: "input",
			disable: true,
		},
		{
			title: "Resource Sharing Level",
			key: "cn_resource_sharing_level",
			required: true,
			type: "radio",
			disable: false,
			options: [
				{
					title: "Shared",
					key: "shared",
				},
				{
					title: "Non-shared",
					key: "non-shared",
				},
			],
		},
		{
			title: "Mobility",
			key: "cn_ue_mobility_level",
			required: true,
			type: "select",
			disable: false,
			options: [
				{
					title: "Stationary",
					key: "stationary",
				},
				{
					title: "Nomadic",
					key: "nomadic",
				},
				{
					title: "Spatially Restricted Mobility",
					key: "spatially restricted mobility",
				},
				{
					title: "Fully Mobility",
					key: "fully mobility",
				},
			],
		},
		{
			title: "Latency (ms)",
			key: "cn_latency",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Max Number of UEs",
			key: "cn_max_number_of_ues",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Activity Factor (%)",
			key: "cn_activity_factor",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "User Downlink Experience Rate（Mbps）",
			key: "cn_exp_data_rate_dl",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "User Uplink Experience Rate（Mbps）",
			key: "cn_exp_data_rate_ul",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "Downlink Regional Traffic Density（Mbps/km ）",
			key: "cn_area_traffic_cap_dl",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Uplink Regional Traffic Density（Mbps/km ）",
			key: "cn_area_traffic_cap_ul",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Script Name",
			key: "cn_script_name",
			required: false,
			type: "input",
			disable: false,
		},
		{
			title: "Max Number of PUD Session",
			key: "sliceProfile_CN_maxNumberofPDUSession",
			required: true,
			type: "input",
			disable: false,
		},
		{
			title: "OverAll User Density",
			key: "sliceProfile_CN_overallUserDensity",
			required: false,
			type: "input",
			disable: false,
		},
	],
};
