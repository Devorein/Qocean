import React, { Component } from 'react';
import pluralize from 'pluralize';
import moment from 'moment';
import { withTheme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import CheckboxInput from '../Input/Checkbox/CheckboxInput';
import ChipContainer from '../../components/Chip/ChipContainer';

import getColouredIcons from '../../Utils/getColoredIcons';
import exportData from '../../Utils/exportData';
import { AppContext } from '../../context/AppContext';

class DataTransformer extends Component {
	static contextType = AppContext;
	transformData = () => {
		let {
			type,
			page,
			data,
			checked,
			hideDetailer,
			getDetails,
			enableFormFiller,
			theme,
			customHandlers,
			deleteResource,
			updateResource,
			watchToggle,
			handleChecked
		} = this.props;
		type = type.toLowerCase();
		page = page.toLowerCase();

		return data.map((item, index) => {
			const actions = [
				!hideDetailer ? (
					<InfoIcon
						className="Displayer_actions-info"
						key={'info'}
						onClick={(e) => {
							getDetails(type, item._id);
						}}
					/>
				) : null
			];
			if (type !== 'user')
				actions.push(
					<GetAppIcon
						className="Displayer_actions-export"
						key={'export'}
						onClick={(e) => {
							exportData(type, [ item ]);
						}}
					/>
				);

			if (page === 'self') {
				actions.push(
					<UpdateIcon
						className="Displayer_actions-update"
						key={'update'}
						onClick={(e) => {
							enableFormFiller(index);
						}}
					/>,
					<DeleteIcon
						className="Displayer_actions-delete"
						key={'delete'}
						onClick={(e) => {
							deleteResource([ item._id ]);
						}}
					/>
				);
			} else if (page.match(/(watchlist|explore)/)) {
				if (type !== 'user' && this.context.user)
					actions.push(
						<NoteAddIcon
							className="Displayer_actions-create"
							key={'create'}
							onClick={(e) => {
								enableFormFiller(index);
							}}
						/>
					);
				if (type.match(/(folder|folders|quiz|quizzes)/) && this.context.user) {
					type = pluralize(type, 2);
					const isWatched = this.context.user.watchlist[
						`watched_${type.charAt(0).toLowerCase() + type.substr(1)}`
					].includes(item._id);
					actions.push(
						<VisibilityIcon
							style={{ fill: isWatched ? theme.palette.success.main : theme.palette.error.main }}
							key={'watch'}
							onClick={(e) => {
								watchToggle([ index ]);
							}}
						/>
					);
				}
			}
			if (page === 'play')
				actions.push(
					<AddCircleIcon
						style={{ fill: item.added ? theme.palette.success.main : this.props.theme.palette.error.main }}
						key={`addtobucketlist${page}`}
						onClick={customHandlers.add.bind(null, [ item._id ])}
					/>
				);
			const temp = {
				...item,
				checked: (
					<div className="Displayer_checked">
						<CheckboxInput checked={checked.includes(index)} onChange={handleChecked.bind(null, index)} />
					</div>
				),
				actions: <div className="Displayer_actions">{actions.map((action) => action)}</div>
			};
			if (item.icon) temp.icon = getColouredIcons(type, item.icon);
			if (item.quiz) temp.quiz = item.quiz.name;
			if (item.user) temp.user = item.user.username;
			if (item.tags) temp.tags = <ChipContainer chips={item.tags} type={'regular'} height={50} />;
			if (page.match(/(self|play)/)) {
				if (item.public !== undefined)
					temp.public = item.public ? (
						<PublicIcon onClick={updateResource.bind(null, [ index ], 'public')} style={{ fill: '#00a3e6' }} />
					) : (
						<PublicIcon onClick={updateResource.bind(null, [ index ], 'public')} style={{ fill: '#f4423c' }} />
					);
				if (item.favourite !== undefined)
					temp.favourite = item.favourite ? (
						<StarIcon onClick={updateResource.bind(null, [ index ], 'favourite')} style={{ fill: '#f0e744' }} />
					) : (
						<StarBorderIcon onClick={updateResource.bind(null, [ index ], 'favourite')} style={{ fill: '#ead50f' }} />
					);
			}
			if (item.watchers) temp.watchers = item.watchers.length;

			if (item.updated_at) temp.updated_at = moment(item.updated_at).fromNow();
			if (item.created_at) temp.created_at = moment(item.created_at).fromNow();
			if (item.joined_at) temp.joined_at = moment(item.joined_at).fromNow();
			if (type === 'environment' && this.context.user) {
				const isCurrentEnv = item._id === this.context.user.current_environment._id;
				temp.name = (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{isCurrentEnv ? <SettingsIcon style={{ fill: '#f0e744', width: '.75em' }} /> : null}
						{item.name}
					</div>
				);
			}
			return temp;
		});
	};

	render() {
		return this.props.children({
			manipulatedData: this.transformData()
		});
	}
}

export default withTheme(DataTransformer);
