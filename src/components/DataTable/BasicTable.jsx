import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import shortid from 'shortid';

import './BasicTable.scss';
class BasicTable extends Component {
	render() {
		const { classes, title, contents } = this.props;
		const { headers, rows, footers } = contents;
		return (
			<div className={`BasicTable ${classes.root}`}>
				<Typography className={classes.tableTitle} variant="body1">
					{title}
				</Typography>
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
					</Table>
				</div>
				<div className={'BasicTable_footer'}>
					{footers.map((data, index) => {
						return (
							<div
								key={shortid.generate()}
								style={{
									width:
										this.Table && this.Table.children[0]
											? this.Table.children[0].children[0].children[index].clientWidth + 'px'
											: 'fit-content'
								}}
							>
								{data}
							</div>
						);
					})}
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
	tableTitle: {
		fontWeight: 'bolder',
		textAlign: 'center',
		padding: 5
	},
	root: {
		'& .BasicTable_footer': {
			backgroundColor: theme.palette.background.main
		}
	}
}))(BasicTable);
