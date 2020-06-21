import React, { Component } from 'react';
import pluralize from 'pluralize';
import moment from 'moment';
import { withTheme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';

import Popover from '../Popover/Popover';
import CheckboxInput from '../Input/Checkbox/CheckboxInput';
import ChipContainer from '../../components/Chip/ChipContainer';
import Icon from '../../components/Icon/Icon';

import getColouredIcons from '../../Utils/getColoredIcons';
import exportData from '../../Utils/exportData';
import { AppContext } from '../../context/AppContext';

class DataTransformer extends Component {
	static contextType = AppContext;
	LOCAL_ICONS = {};
	cloneIcons = (effectors, itemIndex) => {
		return effectors.map((eff, index) => {
			let ref = null;
			if (this.props.selected === itemIndex) ref = (ref) => (this.LOCAL_ICONS[`LOCAL_ACTION_${index + 1}`] = ref);
			if (eff) return <Icon {...eff} key={`${this.props.page}${itemIndex}${index}${eff.icon}`} iconRef={ref} />;
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
					!hideDetailer
						? {
								icon: 'Info',
								onClick: () => {
									fetchData(type, item._id);
								},
								popoverText: 'Show Details'
							}
						: null
				);
				if (type !== 'user')
					actions.push({
						icon: 'GetApp',
						onClick: () => {
							exportData(type, [ item ]);
						},
						popoverText: 'Export Item'
					});

				if (page === 'self') {
					actions.push(
						{
							icon: 'Update',
							onClick: () => {
								enableFormFiller(index);
							},
							popoverText: 'Update Item'
						},
						{
							icon: 'Delete',
							onClick: () => {
								deleteResource([ item._id ]);
							},
							popoverText: 'Delete Item',
							style: {
								fill: theme.darken(theme.palette.error.main, 0.25)
							}
						}
					);
				} else if (page.match(/(watchlist|explore)/)) {
					if (type !== 'user' && this.context.user)
						actions.push({
							icon: 'NoteAdd',
							onClick: () => {
								enableFormFiller(index);
							},
							popoverText: 'Create from Item'
						});
					if (type.match(/(folder|folders|quiz|quizzes)/) && this.context.user) {
						type = pluralize(type, 2);
						const isWatched = this.context.user.watchlist[
							`watched_${type.charAt(0).toLowerCase() + type.substr(1)}`
						].includes(item._id);
						actions.push({
							icon: 'Visibility',
							onClick: () => {
								watchToggle([ index ]);
							},
							popoverText: 'Toggle watch',
							style: { fill: isWatched ? theme.palette.success.main : theme.palette.error.main }
						});
					}
				}

				if (page === 'play')
					actions.push({
						icon: 'AddCircle',
						onClick: customHandlers.add.bind(null, [ item._id ]),
						popoverText: item.added ? 'Remove from bucket' : 'Add to bucket',
						style: { fill: item.added ? theme.palette.success.main : this.props.theme.palette.error.main }
					});
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
				if (item.public !== undefined) {
					const style = { fill: item.public ? '#00a3e6' : '#f4423c' };
					const popoverText = item.public ? 'Unpublicize item' : 'Publicize item';
					const props = {
						style,
						popoverText,
						icon: 'Public',
						onClick: targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'public') : () => {}
					};
					temp.public = <Icon {...props} />;
				}
				if (item.favourite !== undefined) {
					const style = { fill: item.favourite ? '#f0e744' : '#ead50f' };
					const popoverText = item.favourite ? 'Unstar item' : 'Star item';
					const icon = item.favourite ? 'star' : 'starborder';
					const props = {
						style,
						popoverText,
						icon,
						onClick: targetComp === 'displayer' ? updateResource.bind(null, [ index ], 'favourite') : () => {}
					};
					temp.favourite = <Icon {...props} />;
				}
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
