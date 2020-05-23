import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: { main: blue['500'] },
		text: {
			primary: '#ddd',
			secondary: '#ccc'
		},
		error: {
			main: red[500],
			dark: red['900']
		}
	},
	typography: {
		fontFamily: 'Quantico'
	}
});
export default theme;
