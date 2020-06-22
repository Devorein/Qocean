import React from 'react';

class IdList extends React.Component {
	state = {
		ids: []
	};

	removeFromList = (selectedIds) => {
		const { ids } = this.state;
		selectedIds.forEach((selectedId) => {
			ids.splice(ids.indexOf(selectedId), 1);
		});
		this.setState({
			ids
		});
	};

	addToList = (selectedIds) => {
		const { ids } = this.state;
		if (selectedIds.length !== 0) {
			selectedIds.forEach((selectedId) => {
				if (selectedId) {
					const index = ids.indexOf(selectedId);
					if (index === -1) ids.push(selectedId);
					else ids.splice(index, 1);
				}
			});
			this.setState({
				ids
			});
		}
	};

	render() {
		return this.props.children({
			addToList: this.addToList,
			removeFromList: this.removeFromList,
			ids: this.state.ids
		});
	}
}

export default IdList;
