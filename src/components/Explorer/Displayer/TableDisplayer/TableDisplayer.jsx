import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Color from 'color';
import convert from 'color-convert';
import './TableDisplayer.scss';

class TableDisplayer extends Component {
	render() {
		const { type, classes } = this.props;
		let { data, cols } = this.props;
		cols.unshift('checked', 'actions');

		return (
			<div className={`TableDisplayer TableDisplayer-${type}`}>
				<Table className={classes.table}>
					<TableHead className={'TableDisplayer_header'}>
						<TableRow className={`TableDisplayer_header_row TableDisplayer_row`}>
							{cols.map((col, index) => (
								<TableCell
									key={`${col}${index}`}
									align={'center'}
									className={`TableDisplayer_header_cell TableDisplayer_cell`}
								>
									{col.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody className={'TableDisplayer_body'}>
						{data.map((item) => (
							<TableRow key={item._id} className={`TableDisplayer_body_row TableDisplayer_row`}>
								{cols.map((col, index) => (
									<TableCell
										key={`${col}${item[col]}${index}`}
										align="center"
										className={`TableDisplayer_body_cell TableDisplayer_cell`}
									>
										{item[col]}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default withStyles((theme) => ({
	table: {
		'& .TableDisplayer_header': {
			background: theme.palette.background.dark
		},
		'& .TableDisplayer_body': {
			background: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.25).hex()
		},
		'& .MuiTableCell-body': {
			padding: 5
		}
	}
}))(TableDisplayer);
