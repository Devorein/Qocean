import React, { Component } from 'react';

import DataDisplayer from '../../../Visualizations/DataDisplayer/DataDisplayer';

import './ListDisplayer.scss';
class ListDisplayer extends Component {
	render() {
		const { type, page, data, currentSelected } = this.props;
		return <DataDisplayer type={type} page={page} currentSelected={currentSelected} view={'List'} data={data} />;
	}
}

export default ListDisplayer;
