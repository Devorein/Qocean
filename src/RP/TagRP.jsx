import { Component } from 'react';

class TagRP extends Component {
	state = {
		tags: this.props.tags || []
	};

	static getDerivedStateFromProps(props, state) {
		return props.tags.every((tag, index) => tag === state.tags[index])
			? null
			: {
					tags: props.tags
				};
	}

	setTags = (tags) => {
		this.setState({
			tags
		});
	};

	resetTags = () => {
		this.setState({
			tags: []
		});
	};

	render() {
		const { setTags, resetTags } = this;
		return this.props.children({
			setTags,
			resetTags,
			tags: this.state.tags
		});
	}
}

export default TagRP;
