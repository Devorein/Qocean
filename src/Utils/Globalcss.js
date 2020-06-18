import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

export default withStyles(
	(theme) => {
		return {
			'@global': {
				'.App': {
					backgroundColor: theme.lighten(theme.palette.background.dark, 0.15)
				},
				'.MuiPaper-root': {
					backgroundColor: theme.lighten(theme.palette.background.dark, 0.25)
				},
				'.MuiTab-root': {
					minWidth: 100
				},
				'.MuiMenuItem-root': {
					fontSize: '16px'
				},
				'.MuiButtonBase-root.MuiCheckbox-root': {
					margin: 0
				},
				'.MuiTreeView-root': {
					margin: '10px 0px'
				},
				'.MuiFormLabel-root': {
					color: theme.palette.grey[400],
					fontSize: '14px',
					margin: '5px 0px',
					'&.Mui-focused': {
						opacity: 1,
						fontWeight: 'bolder'
					}
				},
				'.MuiFormControl-root': {
					margin: '5px',
					width: '100%'
				},
				'.MuiFormHelperText-root': {
					fontWeight: 'bold',

					'&.Mui-disabled': {
						fontWeight: 'bolder'
					}
				},
				'.MuiButtonBase-root': {
					display: 'block',
					margin: '5px auto',
					color: theme.palette.text.primary,
					fontWeight: 'bolder',
					'& .MuiButton-label': {
						color: theme.palette.text.primary,
						fontWeight: 'bold'
					},
					'&.MuiButton-contained.MuiButton-containedPrimary.Mui-disabled': {
						backgroundColor: theme.palette.error.dark
					}
				},
				'.MuiInput-underline': {
					'&:before': {
						borderBottomColor: theme.palette.text.secondary
					},
					paddingBottom: '5px'
				},
				'.MuiTabs-flexContainer': {
					background: theme.palette.background.dark
				},
				'.MuiTab-wrapper': {
					flexDirection: 'row'
				},
				'.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
					marginRight: '5px',
					marginBottom: '0px'
				},
				'.MuiIcon-root': {
					marginRight: '5px',
					display: 'flex'
				},
				'.MuiSelect-select': {
					display: 'flex',
					alignItems: 'center'
				},
				'.MuiMenuItem-root.MuiListItem-root': {
					display: 'flex',
					flexDirection: 'row'
				},
				'.MuiListItem-root': {
					padding: 10,
					height: 40
				},
				'.MuiListItem-button': {
					'&:hover': {}
				},
				'.MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {},
				'.MuiButton-contained': {
					backgroundColor: theme.palette.background.main,
					'&:hover': {}
				},
				'.MuiButton-contained.MuiButton-containedPrimary': {
					backgroundColor: theme.palette.primary.dark,
					'&:hover': {
						backgroundColor: theme.darken(theme.palette.primary.dark, 0.05)
					}
				},
				'.MuiAlert': {
					'&-filledSuccess': {
						backgroundColor: green[600]
					},
					'&-filledError': {
						backgroundColor: red[600]
					}
				},

				'.MuiTypography-root': {
					fontFamily: theme.typography.fontFamily
				},
				'.MuiDialogContent-root': {
					outline: 'none'
				},
				'.MuiPickersCalendarHeader-iconButton': {
					backgroundColor: theme.palette.primary.dark,
					'&.MuiButtonBase-root': {
						margin: '5px 8px'
					}
				}
			}
		};
	},
	{ withTheme: true }
)(() => null);
