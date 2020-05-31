import React from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';

const FlexCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ReportBodyItemHeader = styled.div`
	background: ${(props) => props.theme.palette.background.dark};
	& .report_body_item_header_validation--correct {
		background-color: ${(props) => props.theme.palette.success.main};
	}

	& .report_body_item_header_validation--incorrect {
		background-color: ${(props) => props.theme.palette.error.main};
	}
`;

export default withTheme(({ stat, theme, validations, answer }) => {
	return (
		<ReportBodyItemHeader theme={theme}>
			<FlexCenter>
				<div
					className={`report_body_item_header_validation report_body_item_header_validation--${validations &&
					validations.correct.includes(stat._id)
						? 'correct'
						: 'incorrect'}`}
				/>
				<div key={shortid.generate()} className={`report_body_item_header--name report_body_item_header_item`}>
					{stat.name}
				</div>
			</FlexCenter>
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
