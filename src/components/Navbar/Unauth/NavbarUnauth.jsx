import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreIcon from '@material-ui/icons/Explore';
import HomeIcon from '@material-ui/icons/Home';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LockIcon from '@material-ui/icons/Lock';
class NavbarUnauth extends Component {
	switchPage = (page) => {
		this.props.history.push(`/${page}`);
	};

	render() {
		const headers = [
			{ name: 'home', link: '', icon: <HomeIcon /> },
			{ name: 'explore', link: 'explore', icon: <ExploreIcon /> },
			{ name: 'signin', link: 'signin', icon: <VpnKeyIcon /> },
			{ name: 'signup', link: 'signup', icon: <LockIcon /> }
		];
		const index = headers.findIndex(({ link }) => link === this.props.location.pathname.replace('/', ''));

		return (
			<Fragment>
				<Tabs
					value={index === -1 ? 0 : index}
					onChange={(e, value) => {
						this.switchPage(headers[value].link);
					}}
					indicatorColor="primary"
					textColor="primary"
					centered
				>
					{headers.map(({ name, icon }) => <Tab key={name} label={name} icon={icon} />)}
				</Tabs>
			</Fragment>
		);
	}
}

export default withRouter(NavbarUnauth);
