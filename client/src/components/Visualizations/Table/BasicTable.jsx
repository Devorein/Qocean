import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import './BasicTable.scss';

class BasicTable extends Component {
	render() {
		const { classes, contents } = this.props;
		const { headers, footers, rows } = contents;
		return (
			<div className={`BasicTable ${classes.root}`}>
				<div className="BasicTable_table">
					<Table
						stickyHeader
						size="small"
						className={classes.table}
						aria-label="basic table"
						ref={(r) => (this.Table = r)}
					>
						<TableHead classes={{ root: classes.tableHead }}>
							<TableRow>
								{headers.map(({ label, name, align }) => (
									<TableCell key={name} align={align ? align : 'center'}>
										{label ? label : name.charAt(0).toUpperCase() + name.substr(1)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>

						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.name}>
									{headers.map(({ name }, index) => (
										<TableCell key={`${name}${row[name]}${index}`} align="center">
											{row[name]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
						<TableFooter className={'BasicTable_footer'}>
							<TableRow key={'BasicTable_footer'}>
								{footers.map((data, index) => (
									<TableCell key={`${data}${index}`} align="center">
										{data}
									</TableCell>
								))}
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</div>
		);
	}
}

export default withStyles((theme) => ({
	tableHead: {
		backgroundColor: theme.palette.background.dark,
		padding: 5,
		'& .MuiTableCell-stickyHeader': {
			backgroundColor: theme.palette.background.dark
		}
	},
	root: {
		'& .BasicTable_footer .MuiTableCell-footer': {
			backgroundColor: theme.palette.background.main
		}
	}
}))(BasicTable);
