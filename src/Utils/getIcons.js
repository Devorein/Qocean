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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import Popover from '../components/Popover/Popover';
import SOUNDS from './getSounds';

export default function getIcons({
	className,
	icon,
	onClick,
	key,
	style = {},
	sound,
	usePopover = false,
	popoverText = 'N/A'
}) {
	if (popoverText !== 'N/A') usePopover = true;
	icon = icon.toLowerCase();
	const ICONS = {
		quiz: HorizontalSplitIcon,
		horizontalsplit: HorizontalSplitIcon,
		question: QuestionAnswerIcon,
		questionanswer: QuestionAnswerIcon,
		environment: SettingsIcon,
		settings: SettingsIcon,
		folderclose: FolderIcon,
		folder: FolderIcon,
		folderopen: FolderOpenIcon,
		user: AccountCircle,
		accountcircle: AccountCircle,
		delete: DeleteIcon,
		upload: PublishIcon,
		publish: PublishIcon,
		link: LinkIcon,
		addcircle: AddCircleIcon,
		star: StarIcon,
		starborder: StarBorderIcon,
		public: PublicIcon,
		update: UpdateIcon,
		info: InfoIcon,
		getapp: GetAppIcon,
		visibility: VisibilityIcon,
		watch: VisibilityIcon,
		noteadd: NoteAddIcon
	};
	const target_icon = React.createElement(ICONS[icon], {
		className,
		onClick: () => {
			if (sound) SOUNDS[sound].play();
			onClick();
		},
		style,
		key: key ? key : ICONS[icon].displayName
	});
	if (usePopover) return <Popover text={popoverText}>{target_icon}</Popover>;
	return target_icon;
}
