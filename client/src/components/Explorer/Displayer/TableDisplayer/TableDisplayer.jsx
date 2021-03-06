import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './TableDisplayer.scss';

class TableDisplayer extends Component {
	render() {
		const { type, classes, currentSelected } = this.props;
		let { data } = this.props;
		const cols = Object.keys(data[0]).filter((key) => key !== '_id');

		return (
			<div className={`TableDisplayer TableDisplayer-${type}`}>
				<Table stickyHeader className={classes.table}>
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
						{data.map((item, index) => (
							<TableRow
								key={item._id}
								className={`TableDisplayer_body_row TableDisplayer_row ${currentSelected === index
									? 'TableDisplayer_row--selected'
									: ''}`}
							>
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
		'& .TableDisplayer_header,& .MuiTableCell-stickyHeader': {
			background: theme.palette.background.dark
		},
		'& .TableDisplayer_body': {
			background: theme.lighten(theme.palette.background.dark, 0.25),
			'& .TableDisplayer_row--selected': {
				backgroundColor: theme.darken(theme.palette.background.dark, 0.25)
			}
		},
		'& .MuiTableCell-body': {
			padding: 5
		}
	}
}))(TableDisplayer);
