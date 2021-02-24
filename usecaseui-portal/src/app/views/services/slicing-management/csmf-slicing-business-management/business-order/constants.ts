export const COMMUNICATION_FORM_ITEMS = [
	/*******
        title /MUST/: MARK THE ITEM NAME,
        key /MUST/:  MARK THE ITEM KEY,
        type /MUST/: MARKE THE ITEM TYPE, CAN BE ADDED IF NECESSARY: input/select/radio/city-select
        required /MUST/: IF REQUIRED, 
        scoped: IF SCOPED NUMBERS, CAN BE EMITTED IF NOT
        scopedText: SCOPED NUMBERS' DESCRIPTION. IF SCOPED NUMBERS EXITS, IT'S A MUST
        placeholder: IF PLACEHOLDER, CAN BE EMITTED IF NOT
        options: IF ITEM NEEDS OPTIONS, CAN BE EMITTED IF NOT
    ********/
	{
		title: "Communication Service Name",
		key: "name",
		type: "input",
		required: true,
	},
	{
		title: "Max Number of UEs",
		key: "maxNumberofUEs",
		type: "input",
		scoped: true,
		scopedText: "Scope: 1-100000",
		required: true,
	},
	{
		title: "Data Rate Uplink (Mbps)",
		key: "expDataRateUL",
		type: "input",
		scoped: true,
		scopedText: "Scope: 100-3000",
		required: true,
	},
	{
		title: "Data Rate Downlink (Mbps)",
		key: "expDataRateDL",
		type: "input",
		scoped: true,
		scopedText: "Scope: 100-3000",
		required: true,
	},
	{
		title: "Latency",
		key: "latency",
		type: "input",
		scoped: true,
		scopedText: "Scope: 10-200",
		required: true,
	},
	{
		title: "Resource Sharing Level",
		key: "resourceSharingLevel",
		type: "radio",
		required: true,
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
		key: "uEMobilityLevel",
		type: "select",
		required: true,
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
		title: "Area",
		key: "coverageArea",
		type: "city-select",
		required: true,
	},
	{
		title: "Coverage Area Number",
		key: "coverageAreaNumber",
		type: "input",
		placeholder:
			"Please enter the coverage area number. Use a comma (,) to separate them if necessary",
		required: false,
	},
];
