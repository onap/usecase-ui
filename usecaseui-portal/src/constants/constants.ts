/*******
    title /MUST/: MARK THE ITEM NAME,
    key /MUST/:  MARK THE ITEM KEY,
    type /MUST/: MARKE THE ITEM TYPE, CAN BE ADDED IF NECESSARY: input/select/radio/city-select/select/table-radio/endpoint
    required /MUST/: IF REQUIRED, 
    disable /MUST/: IF DISABLED,
    scoped: IF SCOPED NUMBERS, CAN BE EMITTED IF NOT
    scopedText: SCOPED NUMBERS' DESCRIPTION. IF SCOPED NUMBERS EXITS, IT'S A MUST
    placeholder: IF PLACEHOLDER, CAN BE EMITTED IF NOT
    options: IF ITEM NEEDS OPTIONS, CAN BE EMITTED IF NOT
********/

export const BUSINESS_REQUIREMENT = [
	{
		title: "Slicing Business Name",
		key: "service_name",
	},
	{
		title: "S-NSSAI",
		key: "service_snssai",
	},
	{
		title: "Data Rate Downlink (Mbps) ",
		key: "exp_data_rate_dl",
	},
	{
		title: "Data Rate Uplink (Mbps) ",
		key: "exp_data_rate_ul",
	},
	{
		title: "Mobility",
		key: "ue_mobility_level",
	},
	{
		title: "Latency (ms)",
		key: "latency",
	},
	{
		title: "Use Interval (Month) ",
		key: "use_interval",
	},

	{
		title: "Activity Factor（%）",
		key: "activity_factor",
	},
	{
		title: "Resource Sharing Level",
		key: "resource_sharing_level",
	},
	{
		title: "Max Number of UEs",
		key: "max_number_of_ues",
	},
	{
		title: "Uplink Regional Traffic Density（Mbps/km ）",
		key: "area_traffic_cap_ul",
	},
	{
		title: "Downlink Regional Traffic Density（Mbps/km ）",
		key: "area_traffic_cap_dl",
	},
	{
		title: "Availability",
		key: "serviceProfile_Availability",
	},
	{
		title: "PLMNIdList",
		key: "serviceProfile_PLMNIdList",
	},
	{
		title: "Reliability",
		key: "serviceProfile_Reliability",
	},
	{
		title: "Uplink throughput per UE",
		key: "serviceProfile_ULThptPerUE",
	},
	{
		title: "Downlink throughput per UE",
		key: "serviceProfile_DLThptPerUE",
	},
	{
		title: "Uplink throughput per network slice",
		key: "serviceProfile_ULThptPerSlice",
	},
	{
		title: "Downlink throughput per network slice",
		key: "serviceProfile_DLThptPerSlice",
	},
	{
		title: "Maximum packet size",
		key: "serviceProfile_MaxPktSize",
	},
	{
		title: "Maximum Number of Connections",
		key: "serviceProfile_MaxNumberofConns",
	},
	{
		title: "Terminal density",
		key: "serviceProfile_TermDensity",
	},
	{
		title: "jitter",
		key: "serviceProfile_Jitter",
	},
	{
		title: "survivalTime",
		key: "serviceProfile_SurvivalTime",
	},

	[
		{
			title: "Area",
			key: "area",
		},
	],
];

export const BUSINESS_STATUS = ["All", "Activated", "Deactivated"];
