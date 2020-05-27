import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, pink } from '@material-ui/core/colors';

const theme = (current_environment) => {
	const { primary_color, secondary_color, display_font = 'Quantico' } = current_environment;
	window.WebFont.load({
		google: {
			families: [ display_font ]
		}
	});
	return createMuiTheme({
		palette: {
			type: 'dark',
			primary: { main: primary_color ? primary_color : blue['500'] },
			secondary: { main: secondary_color ? secondary_color : pink.A400 },
			text: {
				primary: '#ddd',
				secondary: '#ccccccd1'
			},
			error: {
				main: red[500],
				dark: red['900']
			}
		},
		typography: {
			fontFamily: display_font
		}
	});
};
export default theme;
