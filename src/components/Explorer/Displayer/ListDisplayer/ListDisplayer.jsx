import React, { Component } from 'react';

import DataDisplayer from '../../../Visualizations/DataDisplayer/DataDisplayer';

import './ListDisplayer.scss';
class ListDisplayer extends Component {
	render() {
		const { type, page, data, selected } = this.props;
		return <DataDisplayer type={type} page={page} view={'List'} data={data} selected={selected} />;
	}
}

export default ListDisplayer;
