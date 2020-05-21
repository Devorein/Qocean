import React from 'react';
import { red, orange, yellow, green, blue, indigo, purple } from '@material-ui/core/colors';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';

function getColouredIcons(icon, color) {
	function detectColor(color) {
		switch (color) {
			case 'red':
				return red[500];
			case 'orange':
				return orange[500];
			case 'yellow':
				return yellow[500];
			case 'green':
				return green[500];
			case 'blue':
				return blue[500];
			case 'indigo':
				return indigo[500];
			case 'purple':
				return purple[500];

			default:
				return red[500];
		}
	}

	if (icon === 'Folder') return <FolderIcon style={{ fill: detectColor(color) }} />;
	else if (icon === 'Settings') return <SettingsIcon style={{ fill: detectColor(color) }} />;
}

export default getColouredIcons;
