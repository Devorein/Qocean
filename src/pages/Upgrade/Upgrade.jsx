import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';
import { withStyles } from '@material-ui/core/styles';

import './Upgrade.scss';

class Upgrade extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className="Upgrade page">
				<div className={`Upgrade_Content ${classes.root}`}>
					{[ 'Rower', 'Sailor', 'Captain' ].map((version) => {
						return (
							<div className={`Upgrade_Content_Card Upgrade_Content_Card-${version}`} key={version}>
								<div className={`Upgrade_Content_Card_text Upgrade_Content_Card-${version}_text`}>{version}</div>
								<GenericButton
									text={'Apply'}
									className={`Upgrade_Content_Card_button Upgrade_Content_Card-${version}_button`}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		'& .Upgrade_Content_Card': {
			backgroundColor: theme.palette.background.dark
		},
		'& .Upgrade_Content_Card_text': {
			backgroundColor: theme.palette.background.main
		}
	}
}))(Upgrade);
