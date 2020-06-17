import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import DataDisplayer from '../../../Visualizations/DataDisplayer/DataDisplayer';

import './BoardDisplayer.scss';

class BoardDisplayer extends Component {
	render() {
		const { type, page, data, currentSelected } = this.props;
		return <DataDisplayer type={type} page={page} currentSelected={currentSelected} view={'Board'} data={data} />;
	}
}

export default withStyles((theme) => ({
	BoardDisplayer_item: {
		backgroundColor: theme.palette.background.main
	}
}))(BoardDisplayer);
