import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
	'@global': {
		'.MuiMenu-list': {
			background: '#343434',
			color: '#c4c4c4'
		},
		'.MuiMenuItem-root': {
			fontFamily: 'Quantico',
			fontSize: '16px'
		},
		'.MuiInputBase-input': {
			fontFamily: 'Quantico',
			color: '#ddd'
		},
		'.MuiFormLabel-root': {
			fontFamily: 'Quantico',
			color: '#ccc',
			opacity: '0.75',
			fontSize: '14px',
			margin: '5px 0px',
			'&.Mui-focused': {
				opacity: 1,
				fontWeight: 'bolder'
			},
			'&.Mui-disabled': {
				color: '#bbb'
			}
		},
		'.MuiFormControl-root': {
			margin: '5px'
		},
		'.MuiFormHelperText-root': {
			color: '#f44336d6',
			fontWeight: 'bold',
			fontFamily: 'Quantico',
			'&.Mui-disabled': {
				color: '#ddd',
				fontWeight: 'bolder'
			}
		},
		'.MuiButtonBase-root': {
			display: 'block',
			margin: '5px auto',
			fontFamily: 'Quantico',
			color: '#ddd',
			fontWeight: 'bolder',
			'& .MuiButton-label': {
				color: '#ddd',
				fontWeight: 'bold'
			},
			'&.MuiButton-contained.MuiButton-containedPrimary.Mui-disabled': {
				backgroundColor: '#c10000'
			}
		},
		'.MuiInput-underline': {
			paddingBottom: '5px'
		},
		'.MuiTabs-flexContainer': {
			background: '#272727'
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
		'.MuiTypography-root': {
			fontFamily: 'Quantico'
		},
		'.MuiListItem-button': {
			'&:hover': {
				backgroundColor: 'rgba(0, 0, 0, 0.2)'
			}
		},
		'.MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
			backgroundColor: '#00000059'
		},
		'.MuiButton-contained': {
			backgroundColor: '#2d2d2d',
			'&:hover': {
				backgroundColor: '#535353'
			}
		},
		'.MuiButton-contained.MuiButton-containedPrimary': {
			color: '#fff',
			backgroundColor: '#3f51b5'
		},
		'.MuiAlert': {
			'&-filledSuccess': {
				backgroundColor: green[600]
			},
			'&-filledError': {
				backgroundColor: red[600]
			},
			'&-filledSuccess,&-filledError': {
				fontFamily: 'Quantico'
			}
		}
	}
})(() => null);
