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
import UIfx from 'uifx';

import MouseClickSound from '../../sounds/Mouse Click.mp3';

import Popover from '../Popover/Popover';
import CheckboxInput from '../Input/Checkbox/CheckboxInput';
import ChipContainer from '../../components/Chip/ChipContainer';

import getColouredIcons from '../../Utils/getColoredIcons';
import exportData from '../../Utils/exportData';
import { AppContext } from '../../context/AppContext';

const MouseClick = new UIfx(MouseClickSound, {
	volume: 0.5
});

class DataTransformer extends Component {
	static contextType = AppContext;
	LOCAL_ICONS = {};
	cloneIcons = (effectors, index) => {
		return effectors.map((eff) => {
			let ref = null;
			if (this.props.selected === index) ref = (ref) => (this.LOCAL_ICONS[`LOCAL_${eff.type.displayName}`] = ref);
			if (eff) {
				const clonedEff = React.cloneElement(eff, {
					...eff.props,
					key: `${eff.props.children.type.displayName}${this.props.page}`,
					ref
				});
				return clonedEff;
			}
			return null;
		});
	};

	transformData = () => {
		let {
			type,
			page,
			checked,
			hideDetailer,
			fetchData,
			enableFormFiller,
			theme,
			customHandlers,
			deleteResource,
			updateResource,
			watchToggle,
			handleChecked,
			targetComp = 'displayer'
		} = this.props;
		type = type.toLowerCase();
		page = page.toLowerCase();

		const transformData = (item, index) => {
			const actions = [];
			if (targetComp === 'displayer') {
				actions.push(
					!hideDetailer ? (
						<Popover text="Show details">
							<InfoIcon
								className="Displayer_actions-info"
								onClick={(e) => {
									MouseClick.play();
									fetchData(type, item._id);
								}}
							/>
						</Popover>
					) : null
				);
				if (type !== 'user')
					actions.push(
						<Popover text="Export item">
							<GetAppIcon
								className="Displayer_actions-export"
								onClick={(e) => {
									MouseClick.play();
									exportData(type, [ item ]);
								}}
							/>
						</Popover>
					);

				if (page === 'self') {
					actions.push(
						<Popover text="Update item">
							<UpdateIcon
								className="Displayer_actions-update"
								onClick={(e) => {
									MouseClick.play();
									enableFormFiller(index);
								}}
							/>
						</Popover>,
						<Popover text="Delete item">
							<DeleteIcon
								className="Displayer_actions-delete"
								onClick={(e) => {
									deleteResource([ item._id ]);
								}}
							/>
						</Popover>
					);
				} else if (page.match(/(watchlist|explore)/)) {
					if (type !== 'user' && this.context.user)
						actions.push(
							<Popover text="Create from item">
								<NoteAddIcon
									className="Displayer_actions-create"
									onClick={(e) => {
										MouseClick.play();
										enableFormFiller(index);
									}}
								/>
							</Popover>
						);
					if (type.match(/(folder|folders|quiz|quizzes)/) && this.context.user) {
						type = pluralize(type, 2);
						const isWatched = this.context.user.watchlist[
							`watched_${type.charAt(0).toLowerCase() + type.substr(1)}`
						].includes(item._id);
						actions.push(
							<Popover text="Toggle watch">
								<VisibilityIcon
									style={{ fill: isWatched ? theme.palette.success.main : theme.palette.error.main }}
									onClick={(e) => {
										MouseClick.play();
										watchToggle([ index ]);
									}}
								/>
							</Popover>
						);
					}
				}
				if (page === 'play')
					actions.push(
						<Popover text="Add to quiz">
							<AddCircleIcon
								style={{ fill: item.added ? theme.palette.success.main : this.props.theme.palette.error.main }}
								onClick={customHandlers.add.bind(null, [ item._id ])}
							/>
						</Popover>
					);
			}

			const temp = {
				...item
			};
			if (targetComp === 'displayer') {
				temp.checked = (
					<div className="Displayer_checked">
						<Popover text="Check item">
							<CheckboxInput
								checked={checked.includes(index)}
								onChange={(e) => {
									handleChecked(index, e.nativeEvent);
								}}
							/>
						</Popover>
					</div>
				);
				temp.actions = <div className="Displayer_actions">{this.cloneIcons(actions, index)}</div>;
			}
			if (item.image) {
				let src = null;
				const isLink = item.image ? item.image.match(/^(http|data)/) : `http://localhost:5001/uploads/none.png`;
				if (isLink) src = item.image;
				else src = `http://localhost:5001/uploads/${item.image}`;
				temp.image = <img src={src} alt={`${type}`} />;
			}

			if (item.icon) temp.icon = getColouredIcons(type, item.icon);
			if (item.tags) temp.tags = <ChipContainer chips={item.tags} type={'regular'} height={50} />;
			if (page.match(/(self|play)/)) {
				if (item.public !== undefined)
					temp.public = item.public ? (
						<Popover text="Unpublicize item">
							<PublicIcon
								onClick={targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'public') : () => {}}
								style={{ fill: '#00a3e6' }}
							/>
						</Popover>
					) : (
						<Popover text="Publicize item">
							<PublicIcon
								onClick={targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'public') : () => {}}
								style={{ fill: '#f4423c' }}
							/>
						</Popover>
					);
				if (item.favourite !== undefined)
					temp.favourite = item.favourite ? (
						<Popover text="Unstar item">
							<StarIcon
								onClick={targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'favourite') : () => {}}
								style={{ fill: '#f0e744' }}
							/>
						</Popover>
					) : (
						<Popover text="Star item">
							<StarBorderIcon
								onClick={targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'favourite') : () => {}}
								style={{ fill: '#ead50f' }}
							/>
						</Popover>
					);
			}
			// if (item.watchers) temp.watchers = item.watchers.length;

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
		};
		const { data } = this.props;
		return data && data.length !== 0 ? (Array.isArray(data) ? data.map(transformData) : transformData(data, 0)) : null;
	};

	render() {
		return this.props.children({
			manipulatedData: this.transformData(),
			LOCAL_ICONS: this.LOCAL_ICONS
		});
	}
}

export default withTheme(DataTransformer);
