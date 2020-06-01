import React from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';

const ReportBodyItemHeader = styled.div`
	background: ${(props) => props.theme.palette.background.dark};
	& .report_body_item_header_meta--validation--correct span.result {
		color: ${(props) => props.theme.palette.success.main};
	}

	& .report_body_item_header_meta--validation--incorrect span.result {
		color: ${(props) => props.theme.palette.error.main};
	}
`;

export default withTheme(({ stat, theme, validations, answer }) => {
	const isValid = validations && validations.correct.includes(stat._id);
	return (
		<ReportBodyItemHeader theme={theme} className={`report_body_item_header report_body_item_header--${stat.type}`}>
			<div key={shortid.generate()} className={`report_body_item_header--name report_body_item_header_item`}>
				{stat.name}
			</div>
			<div className="report_body_item_header_meta report_body_item_header_item">
				<div
					key={shortid.generate()}
					className={`report_body_item_header_meta--validation--${isValid
						? 'correct'
						: 'incorrect'} report_body_item_header_meta_item`}
					style={{ backgroundColor: theme.palette.background.light }}
				>
					Result: <span className="result">{isValid ? 'Correct' : 'Incorrect'}</span>
				</div>
				{[ 'type', 'time_allocated', 'time_taken', 'weight', 'difficulty', 'points' ].map((item) => (
					<div
						key={shortid.generate()}
						className={`report_body_item_header_meta--${item} report_body_item_header_meta_item`}
						style={{ backgroundColor: theme.palette.background.light }}
					>
						{item.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}
						{': '}
						{stat[item]}
					</div>
				))}
			</div>
		</ReportBodyItemHeader>
	);
});
