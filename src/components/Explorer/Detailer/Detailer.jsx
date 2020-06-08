import React, { Component } from 'react';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';

class Detailer extends Component {
	static contextType = AppContext;
	render() {
		const { type, data } = this.props;

		const manipulatedData = data
			? sectorizeData(data, type, {
					authenticated: this.context.user,
					singularSectorize: true,
					purpose: 'detail'
				})
			: null;
		return <div className="Detailer">Detailer</div>;
	}
}

export default Detailer;
