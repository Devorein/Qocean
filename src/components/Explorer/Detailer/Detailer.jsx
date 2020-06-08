import React, { Component } from 'react';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';

class Detailer extends Component {
	static contextType = AppContext;

	renderDetailer = () => {
		const { type, data } = this.props;

		const manipulatedData = data
			? sectorizeData(data, type, {
					authenticated: this.context.user,
					singularSectorize: true,
					purpose: 'detail'
				})
			: null;

		if (manipulatedData) {
			return [ 'primary', 'secondary', 'tertiary', 'refs' ].map((sector) => (
				<div className={`Detailer_container Detailer_container-${sector}`} key={sector}>
					{Object.entries(manipulatedData[sector]).map(([ key, value ]) => (
						<div className={`Detailer_container_item Detailer_container-${sector}_item`} key={key}>
							<span className={`Detailer_container_item-key Detailer_container-${sector}_item-key`}>
								{key.split('_').map((c) => c.charAt(0).toUpperCase() + c.substr(1))}
							</span>
							<span className={`Detailer_container_item-value Detailer_container-${sector}_item-value`}>
								{value.toString()}
							</span>
						</div>
					))}
				</div>
			));
		}
	};
	render() {
		return <div className="Detailer">{this.renderDetailer()}</div>;
	}
}

export default Detailer;
