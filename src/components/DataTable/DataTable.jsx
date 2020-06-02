import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { withTheme } from '@material-ui/core';
import Color from 'color';
import convert from 'color-convert';

const getMuiTheme = (theme) =>
	createMuiTheme({
		overrides: {
			MUIDataTablePagination: {
				root: {
					overflow: 'hidden',
					border: 'none',
					backgroundColor: theme.palette.background.dark
				}
			},
			MuiTablePagination: {
				actions: {
					display: 'flex',
					backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.15).hex(),
					borderRadius: 3,
					'& svg': {
						width: '1em',
						color: theme.palette.text.primary
					}
				},
				caption: {
					color: theme.palette.text.primary,
					fontFamily: theme.typography.fontFamily
				},
				select: {
					color: theme.palette.text.primary,
					fontWeight: 'bolder',
					fontFamily: theme.typography.fontFamily,
					display: 'flex',
					alignItems: 'center'
				}
			},
			MuiSelect: {
				icon: {
					color: theme.palette.text.primary,
					width: '1em'
				}
			},
			MuiSvgIcon: {
				root: {
					width: '.75em',
					color: theme.palette.text.primary,
					'&:hover': {
						cursor: 'pointer'
					}
				}
			},
			MUIDataTableToolbar: {
				titleText: {
					fontSize: '2em',
					fontWeight: 'bolder',
					color: theme.palette.text.primary,
					textTransform: 'capitalize'
				},
				actions: {
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.15).hex(),
					borderRadius: 3,
					padding: 5,
					'& .MuiButtonBase-root': {
						margin: '0'
					},
					'& svg': {
						width: '1em',
						color: theme.palette.text.primary
					}
				}
			},
			MuiPaper: {
				root: {
					backgroundColor: theme.palette.background.main
				}
			},
			MuiToolbar: {
				regular: {
					minHeight: 50,
					height: 50,
					paddingRight: 5,
					backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).darken(0.15).hex()
				}
			},
			MUIDataTableHeadCell: {
				fixedHeaderCommon: {
					backgroundColor: theme.palette.background.dark,
					color: theme.palette.text.primary,
					fontFamily: theme.typography.fontFamily
				},
				fixedHeaderYAxis: {
					border: 'none',
					textAlign: 'center',
					fontWeight: 'bolder'
				},
				toolButton: {
					justifyContent: 'center'
				}
			},
			MUIDataTableBodyCell: {
				root: {
					backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.15).hex(),
					color: theme.palette.text.primary,
					fontFamily: theme.typography.fontFamily,
					borderBottom: 'none',
					textAlign: 'center'
				}
			},
			MUIDataTableSelectCell: {
				headerCell: {
					backgroundColor: theme.palette.background.dark
				},
				fixedHeaderCommon: {
					backgroundColor: theme.palette.background.dark,
					borderBottom: 'none'
				}
			},
			MuiMenuItem: {
				root: {
					color: theme.palette.text.primary,
					fontFamily: theme.typography.fontFamily,
					'&:hover': {
						backgroundColor: theme.palette.background.dark
					}
				}
			}
		}
	});
export default withTheme(function DataTable({ data, columns, title, options, theme }) {
	return (
		<MuiThemeProvider theme={getMuiTheme(theme)}>
			<MUIDataTable title={title} data={data} columns={columns} options={options} />
		</MuiThemeProvider>
	);
});
