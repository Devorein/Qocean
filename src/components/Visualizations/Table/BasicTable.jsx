import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TextInput from '../../Input/TextInput/TextInput';
import localFilter from '../../../Utils/localFilter';
import decideTargetTypes from '../../../Utils/decideTargetType';

import './BasicTable.scss';
class BasicTable extends Component {
	state = {
		searchInput: ''
	};

	filterRows = () => {
		const { contents } = this.props;
		const { headers, rows } = contents;
		const { searchInput } = this.state;
		const terms = searchInput.split('&');
		let filteredData = rows;
		terms.forEach((term) => {
			const [ prop, mod, value ] = term.split('=');
			if (prop && mod && value && filteredData.length !== 0) {
				const { modValues } = decideTargetTypes('number', {
					shouldConvertToSelectItems: false,
					shouldConvertToAcronym: true
				});
				if (modValues.includes(mod) && headers.map(({ name }) => name).includes(prop)) {
					filteredData = filteredData.filter((item) =>
						localFilter({
							targetType: 'number',
							mod,
							value,
							against: item[prop]
						})
					);
				}
			}
		});
		return filteredData;
	};

	render() {
		const { classes, contents } = this.props;
		const { headers, footers } = contents;
		const rows = this.filterRows();
		return (
			<div className={`BasicTable ${classes.root}`}>
				<div>
					<TextInput
						value={this.state.searchInput}
						name={`Search`}
						onChange={(e) => {
							this.setState({
								searchInput: e.target.value
							});
						}}
					/>
				</div>
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
								key={`${data}${index}`}
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
	root: {
		'& .BasicTable_footer': {
			backgroundColor: theme.palette.background.main
		}
	}
}))(BasicTable);
