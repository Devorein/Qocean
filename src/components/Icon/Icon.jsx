import React, { Component } from 'react';
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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RotateLeft from '@material-ui/icons/RotateLeft';
import CancelIcon from '@material-ui/icons/Cancel';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import Popover from '../Popover/Popover';
import SOUNDS from '../../Utils/getSounds';
import { AppContext } from '../../context/AppContext';

import './Icon.scss';

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
	noteadd: NoteAddIcon,
	chevronleft: ChevronLeftIcon,
	chevronright: ChevronRightIcon,
	rotateleft: RotateLeft,
	cancel: CancelIcon,
	addbox: AddBoxIcon,
	playcirclefilled: PlayCircleFilledIcon,
	deletesweep: DeleteSweepIcon,
	filecopy: FileCopyIcon
};

class Icon extends Component {
	static contextType = AppContext;
	render() {
		const {
			className,
			onClick,
			style = {},
			sound = 'MouseClick',
			popoverText = 'N/A',
			onlyIcon = false,
			iconRef
		} = this.props;
		let { icon } = this.props;
		const useHoverTips = this.context.user ? this.context.user.current_environment.hovertips : true;
		const useSound = this.context.user ? this.context.user.current_environment.sound : true;
		icon = icon.toLowerCase();
		let target_icon = ICONS[icon];
		if (!onlyIcon)
			target_icon = React.createElement(ICONS[icon], {
				className: `${className ? className + ' ' : ''}icon`,
				ref: iconRef,
				onClick: (e) => {
					if (useSound) SOUNDS[sound].play();
					if (onClick) onClick(e);
				},
				style
			});
		if (useHoverTips) return <Popover text={popoverText}>{target_icon}</Popover>;
		return target_icon;
	}
}

export default Icon;
