import React, { Component } from 'react';

import localFilter from '../../Utils/localFilter';
import decideTargetTypes from '../../Utils/decideTargetType';
import TextInput from '../Input/TextInput/TextInput';

class LocalFilter extends Component {
	state = {
		searchInput: ''
	};

	filterRows = () => {
		const { data, contents, fixedTargetType, checkAgainst } = this.props;
		let target = data;
		if (contents) target = contents.rows;
		const { searchInput } = this.state;
		const terms = searchInput.split('&');
		let filteredData = target;
		terms.forEach((term) => {
			const [ prop, mod, value ] = term.split('=');
			if (prop && mod && value && filteredData.length !== 0) {
				const { targetType, modValues } = decideTargetTypes(fixedTargetType || prop, {
					shouldConvertToSelectItems: false,
					shouldConvertToAcronym: true
				});
				if (
					targetType &&
					modValues.includes(mod) &&
					filteredData[0][prop] !== null &&
					filteredData[0][prop] !== undefined &&
					checkAgainst
						? checkAgainst.includes(prop)
						: true
				) {
					filteredData = filteredData.filter((item) =>
						localFilter({
							targetType: fixedTargetType || targetType,
							mod,
							value,
							against: item[prop]
						})
					);
				}
			}
		});
		if (contents) {
			const { headers, footers } = contents;
			return {
				headers,
				footers,
				rows: filteredData
			};
		} else return filteredData;
	};

	render() {
		return this.props.children({
			LocalFilterSearch: (
				<div className={this.props.className}>
					<TextInput
						className={`LocalFilter_Search`}
						value={this.state.searchInput}
						name={`Search`}
						onChange={(e) => {
							this.setState({
								searchInput: e.target.value
							});
						}}
					/>
				</div>
			),
			filteredContents: this.filterRows()
		});
	}
}

export default LocalFilter;
