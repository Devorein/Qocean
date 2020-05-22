import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';

const getMuiTheme = () =>
	createMuiTheme({
		overrides: {
			MuiPaper: {
				root: {
					backgroundColor: '#272727'
				}
			},
			MUIDataTableHeadCell: {
				fixedHeaderCommon: {
					backgroundColor: '#1c1c1cde',
					color: '#ddd',
					fontFamily: 'Quantico'
				},
				fixedHeaderYAxis: {
					border: 'none'
				}
			},
			MUIDataTableBodyCell: {
				root: {
					backgroundColor: '#272727',
					color: '#ddd',
					fontFamily: 'Quantico',
					borderBottom: 'none'
				}
			},
			MUIDataTableSelectCell: {
				fixedHeaderCommon: {
					backgroundColor: '#1c1c1cde',
					borderBottom: 'none'
				}
			}
		}
	});

export default function DataTable({ data, columns, title, options }) {
	return (
		<MuiThemeProvider theme={getMuiTheme()}>
			<MUIDataTable title={title} data={data} columns={columns} options={options} />
		</MuiThemeProvider>
	);
}
