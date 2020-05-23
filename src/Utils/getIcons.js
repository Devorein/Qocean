import React from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import AccountCircle from '@material-ui/icons/AccountCircle';

export default function getIcons(icon) {
	switch (icon.toLowerCase()) {
		case 'quiz':
			return <HorizontalSplitIcon />;
		case 'question':
			return <QuestionAnswerIcon />;
		case 'environment':
			return <SettingsIcon />;
		case 'folder':
			return <FolderOpenIcon />;
		case 'user':
			return <AccountCircle />;
		default:
			return <FolderOpenIcon />;
	}
}
