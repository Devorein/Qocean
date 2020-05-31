import React from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';

const ReportBodyItemHeader = styled.div`background: ${(props) => props.theme.palette.background.dark};`;

export default withTheme(({ stat, theme }) => {
	return (
		<ReportBodyItemHeader theme={theme}>
			<div key={shortid.generate()} className={`report_body_item_header--name report_body_item_header_item`}>
				{stat.name}
			</div>
			<div className="report_body_item_header_meta report_body_item_header_item">
				{[ 'type', 'time_allocated', 'time_taken', 'weight' ].map((item) => (
					<div
						key={shortid.generate()}
						className={`report_body_item_header_meta--${item} report_body_item_header_meta_item`}
						style={{ backgroundColor: theme.palette.background.light }}
					>
						{stat[item]}
					</div>
				))}
			</div>
		</ReportBodyItemHeader>
	);
});
