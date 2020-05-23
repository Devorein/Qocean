import React from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/Folder';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';

export default function getIcons(icon) {
	switch (icon.toLowerCase()) {
		case 'quiz':
			return <HorizontalSplitIcon />;
		case 'question':
			return <QuestionAnswerIcon />;
		case 'environment':
			return <SettingsIcon />;
		case 'folderclose':
			return <FolderIcon />;
		case 'folder':
			return <FolderOpenIcon />;
		case 'user':
			return <AccountCircle />;
		case 'delete':
			return <DeleteIcon />;
		default:
			return <FolderOpenIcon />;
	}
}
