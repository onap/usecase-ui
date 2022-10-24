export const STATUS_LIST = {
  Active: 'Active',
  Inactive: 'Inactive'
};

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
		title: "Intent Instance ID",
		key: "instanceId",
		type: "text",
		required: true,
	},
  {
		title: "Resource Protect Level",
		key: "protect",
		type: "radio",
		required: true,
		options: [
			{
				title: "Protect",
				key: true,
			},
			{
				title: "Non-Protect",
				key: false,
			},
		],
	},
	{
		title: "Access Point 1",
    nodeName: 'Name',
    rateName: 'Bandwidth(Gb/s) - Price($1000/month)',
		key: "accessPointOne",
		type: "node_select_one",
		required: true,
	},
	{
		title: "Cloud Point Name",
		key: "cloudPointName",
		type: "select",
		required: true,
		options: [
			{
				title: "tranprotEp_ID_ROOT",
				key: "tranprotEp_ID_ROOT",
			}
		],
	},
];