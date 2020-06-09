import React from 'react';
import { red, orange, yellow, green, blue, indigo, purple } from '@material-ui/core/colors';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';

function getColouredIcons(icon, color) {
	function detectColor(color) {
		if (color.match(/^(red)/i)) return red[500];
		else if (color.match(/^(orange)/i)) return orange[500];
		else if (color.match(/^(yellow)/i)) return yellow[500];
		else if (color.match(/^(green)/i)) return green[500];
		else if (color.match(/^(blue)/i)) return blue[500];
		else if (color.match(/^(indigo)/i)) return indigo[500];
		else if (color.match(/^(purple)/i)) return purple[500];
		else return red[500];
	}
	icon = icon.toLowerCase();
	if (icon.match(/(folder|folders)/)) return <FolderIcon key={color} style={{ fill: detectColor(color) }} />;
	else if (icon.match(/(settings|environment|environments)/))
		return <SettingsIcon key={color} style={{ fill: detectColor(color) }} />;
}

export default getColouredIcons;
