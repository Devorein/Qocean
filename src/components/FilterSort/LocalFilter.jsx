import React, { Component } from 'react';

import localFilter from '../../Utils/localFilter';
import decideTargetTypes from '../../Utils/decideTargetType';
import TextInput from '../Input/TextInput/TextInput';

class LocalFilter extends Component {
	state = {
		searchInput: ''
	};

	filterRows = () => {
		const { contents: { headers, rows, footers } } = this.props;
		const { searchInput } = this.state;
		const terms = searchInput.split('&');
		let filteredData = rows;
		terms.forEach((term) => {
			const [ prop, mod, value ] = term.split('=');
			if (prop && mod && value && filteredData.length !== 0) {
				const { modValues } = decideTargetTypes('number', {
					shouldConvertToSelectItems: false,
					shouldConvertToAcronym: true
				});
				if (modValues.includes(mod) && headers.map(({ name }) => name).includes(prop)) {
					filteredData = filteredData.filter((item) =>
						localFilter({
							targetType: 'number',
							mod,
							value,
							against: item[prop]
						})
					);
				}
			}
		});
		return {
			headers,
			footers,
			rows: filteredData
		};
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
