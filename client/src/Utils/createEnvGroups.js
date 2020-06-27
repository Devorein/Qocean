export default function(group) {
	let selectItems = [];
	if (group === 'explore') selectItems = [ 'user', 'quiz', 'question', 'folder', 'environment' ];
	else if (group === 'self') selectItems = [ 'quiz', 'question', 'folder', 'environment' ];
	else if (group === 'watchlist') selectItems = [ 'quiz', 'folder' ];
	const children = [
		{
			name: `default_${group}_ipp`,
			type: 'select',
			extra: {
				selectItems: [ 10, 15, 20, 30, 40, 50 ].map((ipp) => {
					return {
						text: ipp
					};
				})
			},
			defaultValue: 15
		},
		{
			name: `default_${group}_view`,
			type: 'select',
			extra: {
				selectItems: [ 'List', 'Table', 'Board', 'Gallery' ].map((ipp) => {
					return {
						text: ipp
					};
				})
			},
			defaultValue: 'List'
		}
	];

	if (group !== 'play') {
		children.unshift({
			name: `default_${group}_landing`,
			type: 'select',
			extra: {
				selectItems: selectItems.map((land) => {
					return {
						text: land.charAt(0).toUpperCase() + land.substr(1)
					};
				})
			},
			defaultValue: selectItems[0].charAt(0).toUpperCase() + selectItems[0].substr(1)
		});
	}

	return {
		type: 'group',
		name: `${group.charAt(0).toUpperCase() + group.substr(1)}_group`,
		extra: { treeView: true },
		children
	};
}
