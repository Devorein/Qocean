export default function (group) {
	const capitalize = (word) => word.charAt(0).toUpperCase() + word.substr(1);
	let selectItems = [];
	if (group === 'explore_page') selectItems = [ 'user', 'quiz', 'question', 'folder', 'environment' ];
	else if (group === 'self_page') selectItems = [ 'quiz', 'question', 'folder', 'environment' ];
	else if (group === 'watchlist_page') selectItems = [ 'quiz', 'folder' ];
	else if (group === 'play_page') selectItems = [ 'quiz', 'folder' ];
	const children = [
		{
			name: `default_ipp`,
			type: 'select',
			extra: {
				selectItems: [ 10, 15, 20, 30, 40, 50 ].map((ipp) => ({
					text: ipp
				}))
			},
			defaultValue: 15
		},
		{
			name: `default_view`,
			type: 'select',
			extra: {
				selectItems: [ 'List', 'Table', 'Board', 'Gallery' ].map((ipp) => ({
					text: ipp
				}))
			},
			defaultValue: 'List'
		},
		{
			name: `default_layout`,
			type: 'select',
			extra: {
				selectItems: [ 'Left', 'Right' ].map((ipp) => ({
					text: ipp
				}))
			},
			defaultValue: 'Left'
		}
	];

	if (group !== 'play') {
		children.unshift({
			name: `default_landing`,
			type: 'select',
			extra: {
				selectItems: selectItems.map((land) => ({
					text: capitalize(land)
				}))
			},
			defaultValue: capitalize(selectItems[0])
		});
	}

	return {
		type: 'group',
		name: group,
		extra: { treeView: true, append: true },
		children
	};
}
