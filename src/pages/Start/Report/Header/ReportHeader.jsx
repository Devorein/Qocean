import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';

const ReportHeaderC = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.25).hex()};
`;

class ReportHeader extends Component {
	render() {
		const { theme } = this.props;
		return <ReportHeaderC theme={theme}>Report Header</ReportHeaderC>;
	}
}

export default ReportHeader;
