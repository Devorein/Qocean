import React from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/Folder';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import LinkIcon from '@material-ui/icons/Link';

export default function getIcons(icon, onClick, key) {
	switch (icon.toLowerCase()) {
		case 'quiz':
			return <HorizontalSplitIcon onClick={onClick} key={key ? key : icon} />;
		case 'question':
			return <QuestionAnswerIcon onClick={onClick} key={key ? key : icon} />;
		case 'environment':
			return <SettingsIcon onClick={onClick} key={key ? key : icon} />;
		case 'folderclose':
			return <FolderIcon onClick={onClick} key={key ? key : icon} />;
		case 'folder':
			return <FolderOpenIcon onClick={onClick} key={key ? key : icon} />;
		case 'user':
			return <AccountCircle onClick={onClick} key={key ? key : icon} />;
		case 'delete':
			return <DeleteIcon onClick={onClick} key={key ? key : icon} />;
		case 'upload':
			return <PublishIcon onClick={onClick} key={key ? key : icon} />;
		case 'link':
			return <LinkIcon onClick={onClick} key={key ? key : icon} />;
		default:
			return <FolderOpenIcon onClick={onClick} key={key ? key : icon} />;
	}
}
