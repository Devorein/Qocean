import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';

const getMuiTheme = () =>
	createMuiTheme({
		overrides: {
			MUIDataTablePagination: {
				root: {
					overflow: 'hidden',
					border: 'none',
					backgroundColor: '#131313de'
				}
			},
			MuiTablePagination: {
				actions: {
					display: 'flex'
				},
				caption: {
					color: '#ddd',
					fontFamily: 'Quantico'
				}
			},
			MUIDataTableToolbar: {
				titleText: {
					fontSize: '2em',
					fontWeight: 'bolder',
					color: '#ddd',
					textTransform: 'capitalize'
				},
				actions: {
					display: 'flex',
					justifyContent: 'flex-end',
					'& .MuiButtonBase-root': {
						margin: '0'
					}
				}
			},
			MuiPaper: {
				root: {
					backgroundColor: '#272727'
				}
			},
			MuiToolbar: {
				regular: {
					minHeight: 50,
					height: 50
				}
			},
			MUIDataTableHeadCell: {
				fixedHeaderCommon: {
					backgroundColor: '#131313de',
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
				headerCell: {
					backgroundColor: '#1c1c1cde'
				},
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
