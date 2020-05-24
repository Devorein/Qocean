import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class BasicTable extends Component {
	render() {
		const { classes, headers, rows } = this.props;
		return (
			<Table size="small" className={classes.table} aria-label="basic table">
				<TableHead>
					<TableRow>
						{headers.map(({ label, name, align }) => (
							<TableCell align={align ? align : 'center'}>{label ? label : name}</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name}>
							{headers.map(({ name }) => <TableCell align="right">{row[name]}</TableCell>)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
}

export default withStyles((theme) => ({}))(BasicTable);
