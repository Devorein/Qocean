import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';

const LinearListRoot = styled.div`
	overflow: auto;
	height: 100%;
`;

const LinearListRow = styled.div`
	display: flex;
	justify-content: space-around;
	padding: 5px;
	align-items: center;
`;

const LinearListRowKey = styled.div`
	width: 50%;
	display: flex;
	justify-content: flex-start;
	& span {
		background: ${(props) => props.theme.palette.grey[800]};
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
	render() {
		let target = {};
		const { data, theme, sort = true } = this.props;
		if (sort && data) {
			Object.keys(data).sort().forEach((key) => {
				target[key] = data[key];
			});
		} else target = data;
		return (
			<LinearListRoot className={'linearList'}>
				{data ? (
					Object.entries(target).map(([ key, value ]) => {
						return (
							<LinearListRow key={key} className={`linearListRow`}>
								<LinearListRowKey theme={theme}>
									<span>{key.split('_').map((key) => key.charAt(0).toUpperCase() + key.substr(1)).join(' ')}</span>
								</LinearListRowKey>
								<LinearListRowValue theme={theme}>{value}</LinearListRowValue>
							</LinearListRow>
						);
					})
				) : (
					<div>You havent selected anything yet</div>
				)}
			</LinearListRoot>
		);
	}
}

export default withTheme(LinearList);
