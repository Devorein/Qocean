import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

class PageSwitcher extends Component {
	static contextType = AppContext;

	state = {
		type: this.context.user
			? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_landing`]
			: 'Quiz'
	};

	switchPage = (page) => {
		const { runBeforeSwitch, runAfterSwitch, refetchData } = this.props;
		if (runBeforeSwitch) runBeforeSwitch();
		this.props.history.push(`/${page.link}`);
		if (runAfterSwitch) runAfterSwitch(page.name);
		if (refetchData)
			refetchData(page.name, {
				page: 1,
				limit: this.context.user
					? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_ipp`]
					: 15
			});
		this.setState({
			type: page.name
		});
	};

	decideHeaders = () => {
		let { page } = this.props;
		page = page.toLowerCase();
		if (page === 'explore') return [ 'User', 'Quiz', 'Question', 'Folder', 'Environment' ];
		else if (page.match(/(self|create)/)) return [ 'Quiz', 'Question', 'Folder', 'Environment' ];
		else if (page === 'watchlist') return [ 'Quiz', 'Folder' ];
	};

	render() {
		const { page, match: { params: { type } }, passTabsAsProps = true } = this.props;

		const headers = this.decideHeaders().map((header) => {
			return {
				name: header,
				link: `${page}/${header}`
			};
		});

		const CUSTOM_TABS = (
			<CustomTabs
				against={type}
				onChange={(e, value) => {
					this.switchPage(headers[value]);
				}}
				height={50}
				headers={headers}
			/>
		);

		return this.props.children({
			CustomTabs: passTabsAsProps ? <div className="PageSwitcher">{CUSTOM_TABS}</div> : null,
			type: this.state.type
		});
	}
}

export default withRouter(PageSwitcher);
