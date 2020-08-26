import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, pink } from '@material-ui/core/colors';
import Color from 'color';
import convert from 'color-convert';

const decideBackground = (theme) => {
	if (theme === 'Dark') return [ '#212121', '#424242', '#616161' ];
	else if (theme === 'Light') return [ '#9e9e9e', '#bdbdbd', '#e0e0e0' ];
	else if (theme === 'Navy') return [ blue[600], blue[500], blue[400] ];
	else return [ '#212121', '#424242', '#616161' ];
};
const theme = (current_environment) => {
	const {
		colors: { primary_color, secondary_color, theme = 'dark' } = {},
		display_font = 'Quantico'
	} = current_environment;

	window.WebFont.load({
		google: {
			families: [ display_font ]
		}
	});

	const [ dark, main, light ] = decideBackground(theme);
	return createMuiTheme({
		palette: {
			type: theme.toLowerCase(),
			primary: { main: primary_color ? primary_color : blue['500'] },
			secondary: { main: secondary_color ? secondary_color : pink.A400 },
			text: {
				primary: '#ddd',
				secondary: '#ccccccd1'
			},
			error: {
				main: red[500],
				dark: red['900']
			},
			background: {
				paper: '#fff',
				default: '#fafafa',
				dark,
				main,
				light
			}
		},
		typography: {
			fontFamily: display_font
		},
		darken: (color, amnt) => Color.rgb(convert.hex.rgb(color)).darken(amnt).hex(),
		lighten: (color, amnt) => Color.rgb(convert.hex.rgb(color)).lighten(amnt).hex()
	});
};
export default theme;
