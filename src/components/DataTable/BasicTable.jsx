import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';

class BasicTable extends Component {
	render() {
		const { classes, headers, rows, title } = this.props;
		return (
			<Fragment>
				<Typography className={classes.tableTitle} variant="body1">
					{title}
				</Typography>
				<Table size="small" className={classes.table} aria-label="basic table">
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

					<TableFooter className={classes.tableFooter}>
						<TableRow>
							<TableCell />
							{headers.splice(1).map(({ name }, index) => (
								<TableCell key={`${name}${index}`} align="center">
									{rows.length > 1 ? rows.reduce((row1, row2) => row1[name] + row2[name]) : ''}
								</TableCell>
							))}
						</TableRow>
					</TableFooter>
				</Table>
			</Fragment>
		);
	}
}

export default withStyles((theme) => ({
	tableHead: {
		backgroundColor: theme.palette.background.dark,
		padding: 5
	},
	tableTitle: {
		fontWeight: 'bolder',
		textAlign: 'center',
		padding: 5
	},
	tableFooter: {
		backgroundColor: theme.palette.background.main
	}
}))(BasicTable);
