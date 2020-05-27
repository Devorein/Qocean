import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';

const LinearListRoot = styled.div`
	overflow: auto;
	height: 100%;
`;

const LinearListPrimaryRow = styled.div`padding: 5px;`;

const LinearListRow = styled.div`
	display: flex;
	justify-content: space-around;
	padding: 5px;
	align-items: center;
`;

const LinearListRowPrimaryKey = styled.div`
	width: 50%;
	display: flex;
	justify-content: flex-start;
	& span {
		background: ${(props) => props.theme.palette.background.dark};
		padding: 5px;
		width: fit-content;
	}
`;

const LinearListRowSecondaryKey = styled.div`
	width: 50%;
	display: flex;
	justify-content: flex-start;
	& span {
		background: ${(props) => props.theme.palette.background.main};
		padding: 5px;
		width: fit-content;
	}
`;

const LinearListRowValue = styled.div`
	font-size: 16px;
	width: 50%;
	display: flex;
	justify-content: flex-end;
`;

class LinearList extends Component {
	renderPrimaryData = (primaryData) => {
		return (
			<LinearListPrimaryRow>
				{primaryData.map((key) => {
					const { theme } = this.props;
					const value = this.props.selectedData.data[key];
					return (
						<LinearListRow key={key}>
							<LinearListRowPrimaryKey theme={theme} className={'listrowkey'}>
								<span>
									{key.toString().split('_').map((key) => key.charAt(0).toUpperCase() + key.substr(1)).join(' ')}
								</span>
							</LinearListRowPrimaryKey>
							<LinearListRowValue theme={theme}>{value ? value.toString() : 'N/A'}</LinearListRowValue>
						</LinearListRow>
					);
				})}
			</LinearListPrimaryRow>
		);
	};

	renderSecondaryData = (secondaryData) => {
		return secondaryData.map((key) => {
			const { theme } = this.props;
			const value = this.props.selectedData.data[key];
			return (
				<LinearListRow key={key}>
					<LinearListRowSecondaryKey theme={theme} className={'listrowkey'}>
						<span>{key.toString().split('_').map((key) => key.charAt(0).toUpperCase() + key.substr(1)).join(' ')}</span>
					</LinearListRowSecondaryKey>
					<LinearListRowValue theme={theme}>{value ? value.toString() : 'N/A'}</LinearListRowValue>
				</LinearListRow>
			);
		});
	};

	render() {
		let target = {};
		const { renderPrimaryData, renderSecondaryData } = this;
		const { theme, sort = true } = this.props;
		const selectedData = this.props.selectedData ? this.props.selectedData : {};
		let secondaryData = [];
		let primaryData = [];
		if (selectedData.data) {
			let { data, exclude, primary, secondary = [] } = selectedData;
			Object.entries(data).forEach(([ key, value ]) => {
				if (!exclude.includes(key)) target[key] = value ? value.toString() : null;
			});
			primaryData = primary;
			if (secondary.length !== 0) secondaryData = secondary;
			else
				secondaryData = Object.keys(data).filter(
					(key) => (!primary.includes(key) && !exclude.includes(key) ? key : null)
				);
			if (sort) secondaryData = secondaryData.sort();
		}

		return (
			<LinearListRoot className={'linearList'}>
				{selectedData.data ? (
					<Fragment>
						{renderPrimaryData(primaryData)}
						{renderSecondaryData(secondaryData)}
					</Fragment>
				) : (
					<div>You havent selected anything yet</div>
				)}
			</LinearListRoot>
		);
	}
}

export default withTheme(LinearList);
