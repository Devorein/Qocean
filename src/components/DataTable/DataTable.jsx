import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { withTheme } from '@material-ui/core';
import Color from 'color';
import convert from 'color-convert';

const getMuiTheme = (theme) => {
	const primaryText = theme.palette.text.primary;
	const backgroundDark = theme.palette.background.dark;

	return createMuiTheme({
		overrides: {
			MUIDataTablePagination: {
				root: {
					overflow: 'hidden',
					border: 'none',
					backgroundColor: backgroundDark
				}
			},
			MUIDataTableBodyRow: {
				root: {
					'&:nth-child(odd)': {
						backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).lighten(0.15).hex(),
						'&:hover': {
							transition: 'background-color 150ms ease-in-out',
							backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).lighten(0.35).hex()
						}
					},
					'&:nth-child(even)': {
						backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).darken(0.15).hex(),
						'&:hover': {
							transition: 'background-color 150ms ease-in-out',
							backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).darken(0.35).hex()
						}
					}
				}
			},

			MuiTablePagination: {
				actions: {
					display: 'flex',
					backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).lighten(0.15).hex(),
					borderRadius: 3,
					'& svg': {
						width: '1em',
						color: primaryText
					}
				},
				caption: {
					color: primaryText,
					fontFamily: theme.typography.fontFamily
				},
				select: {
					color: primaryText,
					fontWeight: 'bolder',
					fontFamily: theme.typography.fontFamily,
					display: 'flex',
					alignItems: 'center'
				}
			},
			MuiSelect: {
				icon: {
					color: primaryText,
					width: '1em'
				}
			},
			MuiIconButton: {
				root: {
					'& svg': {
						color: theme.palette.primary.main
					}
				}
			},
			MuiSvgIcon: {
				root: {
					width: '.75em',
					color: primaryText,
					'&:hover': {
						cursor: 'pointer'
					}
				}
			},
			MUIDataTableToolbar: {
				titleText: {
					fontSize: '2em',
					fontWeight: 'bolder',
					color: primaryText,
					textTransform: 'capitalize'
				},
				actions: {
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).lighten(0.15).hex(),
					borderRadius: 3,
					padding: 5,
					'& .MuiButtonBase-root': {
						margin: '0'
					},
					'& svg': {
						width: '1em',
						color: primaryText
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
					backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).darken(0.15).hex()
				}
			},
			MUIDataTableHeadCell: {
				fixedHeaderCommon: {
					backgroundColor: backgroundDark,
					color: primaryText,
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
					color: primaryText,
					fontFamily: theme.typography.fontFamily,
					borderBottom: 'none',
					textAlign: 'center',
					padding: '5px 8px'
				}
			},
			MUIDataTableSelectCell: {
				headerCell: {
					backgroundColor: backgroundDark
				},
				fixedHeaderCommon: {
					backgroundColor: backgroundDark,
					borderBottom: 'none'
				}
			},
			MuiMenuItem: {
				root: {
					color: primaryText,
					fontFamily: theme.typography.fontFamily,
					'&:hover': {
						backgroundColor: backgroundDark
					}
				}
			},
			MUIDataTableToolbarSelect: {
				root: {
					backgroundColor: Color.rgb(convert.hex.rgb(backgroundDark)).darken(0.15).hex(),
					color: primaryText,
					fontFamily: theme.typography.fontFamily
				}
			},
			MuiTypography: {
				subtitle1: {
					fontFamily: theme.typography.fontFamily,
					fontWeight: 'bolder',
					fontSize: '1em'
				}
			}
		}
	});
};

export default withTheme(function DataTable({ data, columns, title, options, theme }) {
	return (
		<MuiThemeProvider theme={getMuiTheme(theme)}>
			<MUIDataTable title={title} data={data} columns={columns} options={options} />
		</MuiThemeProvider>
	);
});
