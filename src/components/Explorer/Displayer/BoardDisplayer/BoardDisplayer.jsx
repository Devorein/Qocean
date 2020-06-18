import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import DataDisplayer from '../../../Visualizations/DataDisplayer/DataDisplayer';

import './BoardDisplayer.scss';

class BoardDisplayer extends Component {
	render() {
		const { type, page, data, selected } = this.props;
		return <DataDisplayer type={type} page={page} view={'Board'} data={data} selected={selected} />;
	}
}

export default withStyles((theme) => ({
	BoardDisplayer_item: {
		backgroundColor: theme.palette.background.main
	}
}))(BoardDisplayer);
