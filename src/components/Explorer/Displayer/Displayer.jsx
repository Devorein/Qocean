import React, { Component, Fragment } from 'react';
import { withTheme } from '@material-ui/core';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';
import ChipContainer from '../../../components/Chip/ChipContainer';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import getColouredIcons from '../../../Utils/getColoredIcons';
import exportData from '../../../Utils/exportData';
import filterSort from '../../../Utils/filterSort';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckboxInput from '../../Input/Checkbox/CheckboxInput';
import axios from 'axios';
import pluralize from 'pluralize';
import moment from 'moment';
import { difference } from 'lodash';
import { HotKeys } from 'react-hotkeys';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import './Displayer.scss';

const keyMap = {
	MOVE_UP: 'up',
	MOVE_DOWN: 'down',
	SELECT: [ 's', 'shift+s', 'alt+s' ],
	ACTION_1: '1',
	ACTION_2: '2',
	ACTION_3: '3',
	ACTION_4: '4',
	GLOBAL_ACTION_1: 'shift+1',
	GLOBAL_ACTION_2: 'shift+2',
	GLOBAL_ACTION_3: 'shift+3',
	GLOBAL_ACTION_4: 'shift+4'
};

const headers = {
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
};

class Displayer extends Component {
	static contextType = AppContext;

	state = {
		currentSelected: 0
	};

	componentDidMount() {
		this.props.refetchData({
			limit: this.context.user ? this.context.user.current_environment.default_self_rpp : 15,
			page: 1
		});
	}

	updateResource = (selectedIndex, field) => {
		let { type, data, updateDataLocally } = this.props;
		const updatedRows = selectedIndex.map((index) => ({ id: data[index]._id, body: { [field]: !data[index][field] } }));
		type = pluralize(type, 2).toLowerCase();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}`,
				{
					[type]: updatedRows
				},
				{
					...headers
				}
			)
			.then(({ data: { data: updatedDatas } }) => {
				this.context.changeResponse('Success', `Successfully updated ${updatedDatas.length} ${type}`);
				selectedIndex.forEach((index, _index) => {
					data[index] = updatedDatas[_index];
				});
				updateDataLocally(data);
			});
	};

	deleteResource = (selectedRows) => {
		const { type } = this.props;
		const deleteResources = (selectedRows) => {
			const target = pluralize(type, 2).toLowerCase();
			return axios.delete(`http://localhost:5001/api/v1/${target}`, {
				...headers,
				data: {
					[target]: selectedRows
				}
			});
		};

		if (type === 'Environment') {
			let containsCurrent = false;
			const temp = [];
			selectedRows.forEach((selectedRow) => {
				if (selectedRow === this.context.user.current_environment._id) containsCurrent = true;
				else temp.push(selectedRow);
			});
			if (containsCurrent) {
				this.context.changeResponse(
					'Cant delete',
					'You are trying to delete a currently activated environment',
					'error'
				);
			}
			if (selectedRows.length >= 1)
				deleteResources(temp).then(({ data: { data } }) => {
					setTimeout(() => {
						this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
					}, 2500);
					this.props.refetchData(this.queryParams);
				});
		} else
			deleteResources(selectedRows).then(({ data: { data } }) => {
				this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
				this.props.refetchData(this.queryParams);
			});
	};

	watchToggle = (selectedIndex) => {
		let { type, data } = this.props;
		const ids = selectedIndex.map((index) => data[index]._id);
		type = pluralize(type, 2).toLowerCase();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}/_/watch${type.charAt(0).toUpperCase() + type.substr(1)}`,
				{
					[type]: ids
				},
				{
					...headers
				}
			)
			.then(({ data: { data } }) => {
				this.context.changeResponse('Success', `Successfully toggled watch for ${data} ${type}`, 'success');
				this.context.refetchUser();
			});
	};

	decideShortcut = (e, { selectedIndex, setSelectedIndex, index }) => {
		const { altKey, shiftKey } = e.nativeEvent;
		if (shiftKey && altKey) {
			const indexes = Array(index + 1).fill(0).map((_, _index) => _index);
			setSelectedIndex(difference(indexes, selectedIndex), true);
		} else if (shiftKey) setSelectedIndex(Array(index + 1).fill(0).map((_, _index) => _index), true);
		else if (altKey) setSelectedIndex([ index ], true);
		else setSelectedIndex(index);
	};

	transformData = (data, selectedIndex, setSelectedIndex) => {
		let { type, page } = this.props;
		type = type.toLowerCase();
		page = page.toLowerCase();

		return data.map((item, index) => {
			const actions = [
				<InfoIcon
					className="Displayer_actions-info"
					key={'info'}
					onClick={(e) => {
						this.props.fetchData(this.props.type, item._id);
					}}
				/>
			];
			if (type !== 'user')
				actions.push(
					<GetAppIcon
						className="Displayer_actions-export"
						key={'export'}
						onClick={(e) => {
							exportData(this.props.type, [ item ]);
						}}
					/>
				);

			if (page === 'self') {
				actions.push(
					<UpdateIcon
						className="Displayer_actions-update"
						key={'update'}
						onClick={(e) => {
							this.props.enableFormFiller(index);
						}}
					/>,
					<DeleteIcon
						className="Displayer_actions-delete"
						key={'delete'}
						onClick={(e) => {
							this.deleteResource([ item._id ]);
						}}
					/>
				);
			} else if (page.match(/(watchlist|explore)/)) {
				if (type !== 'user')
					actions.push(
						<NoteAddIcon
							className="Displayer_actions-create"
							key={'create'}
							onClick={(e) => {
								this.props.enableFormFiller(index);
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
							style={{ fill: isWatched ? this.props.theme.palette.success.main : this.props.theme.palette.error.main }}
							key={'watch'}
							onClick={(e) => {
								this.watchToggle([ index ]);
							}}
						/>
					);
				}
			}

			const temp = {
				...item,
				checked: (
					<div className="Displayer_checked">
						<CheckboxInput
							checked={selectedIndex.includes(index)}
							onChange={(e) => {
								this.decideShortcut(e, { selectedIndex, setSelectedIndex, index });
							}}
						/>
					</div>
				),
				actions: <div className="Displayer_actions">{actions.map((action) => action)}</div>
			};
			if (item.icon) temp.icon = getColouredIcons(this.props.type, item.icon);
			if (item.quiz) temp.quiz = item.quiz.name;
			if (item.user) temp.user = item.user.username;
			if (item.tags) temp.tags = <ChipContainer chips={item.tags} type={'regular'} height={50} />;
			if (page === 'self') {
				if (item.public !== undefined)
					temp.public = item.public ? (
						<PublicIcon onClick={this.updateResource.bind(null, [ index ], 'public')} style={{ fill: '#00a3e6' }} />
					) : (
						<PublicIcon onClick={this.updateResource.bind(null, [ index ], 'public')} style={{ fill: '#f4423c' }} />
					);
				if (item.favourite !== undefined)
					temp.favourite = item.favourite ? (
						<StarIcon onClick={this.updateResource.bind(null, [ index ], 'favourite')} style={{ fill: '#f0e744' }} />
					) : (
						<StarBorderIcon
							onClick={this.updateResource.bind(null, [ index ], 'favourite')}
							style={{ fill: '#ead50f' }}
						/>
					);
			}
			if (item.watchers) temp.watchers = item.watchers.length;

			if (item.updated_at) temp.updated_at = moment(item.updated_at).fromNow();
			if (item.created_at) temp.created_at = moment(item.created_at).fromNow();
			if (item.joined_at) temp.joined_at = moment(item.joined_at).fromNow();
			if (this.props.type === 'Environment') {
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

	decideDisplayer = (data, view, cols, setSelectedIndex) => {
		const { type } = this.props;

		const props = {
			data,
			type,
			currentSelected: this.state.currentSelected
		};

		if (view === 'table') return <TableDisplayer {...props} cols={cols} />;
		else if (view === 'list') return <ListDisplayer {...props} />;
		else if (view === 'board') return <BoardDisplayer {...props} />;
		else if (view === 'gallery') return <GalleryDisplayer {...props} />;
	};

	getCols = (data) => {
		const cols = [];
		if (data.length > 0)
			Object.keys(
				sectorizeData(data[0], this.props.type, { authenticated: this.context.user, singular: true })
			).forEach((col) => {
				if (this.props.page === 'Self' && col.match(/(favourite|public)/)) cols.push(col);
				else if (this.props.page !== 'Self' && !col.match(/(favourite|public)/)) cols.push(col);
			});

		return cols;
	};

	render() {
		const { decideDisplayer, getCols, updateResource, deleteResource, watchToggle } = this;
		const { data, totalCount, page, refetchData, type, filter_sort } = this.props;
		const cols = getCols(data);
		return (
			<div className="Displayer">
				<Effector
					updateResource={updateResource}
					type={type}
					page={page}
					data={data}
					totalCount={totalCount}
					refetchData={refetchData}
					cols={cols}
					deleteResource={deleteResource}
					watchToggle={watchToggle}
					filter_sort={filter_sort}
				>
					{({
						EffectorTopBar,
						EffectorBottomBar,
						view,
						removed_cols,
						setSelectedIndex,
						selectedIndex,
						GLOBAL_ICONS,
						page,
						limit
					}) => {
						this.queryParams = { page, limit, ...filterSort(filter_sort) };
						let manipulatedData = null;
						if (view !== 'table')
							manipulatedData = sectorizeData(this.transformData(data, selectedIndex, setSelectedIndex), type, {
								authenticated: this.context.user,
								blacklist: removed_cols
							});
						else {
							manipulatedData = sectorizeData(this.transformData(data, selectedIndex, setSelectedIndex), type, {
								authenticated: this.context.user,
								blacklist: removed_cols,
								flatten: true
							});
						}
						const handlers = {
							MOVE_UP: (event) => {
								this.setState({
									currentSelected: this.state.currentSelected > 0 ? this.state.currentSelected - 1 : data.length - 1
								});
							},
							MOVE_DOWN: (event) => {
								this.setState({
									currentSelected: this.state.currentSelected < data.length - 1 ? this.state.currentSelected + 1 : 0
								});
							},
							SELECT: (e) => {
								this.decideShortcut(e, { selectedIndex, setSelectedIndex, index: this.state.currentSelected });
							},
							ACTION_1: (e) => {
								this.props.setDetailerIndex(this.state.currentSelected);
							},
							ACTION_2: (e) => {
								exportData(type, [ data[this.state.currentSelected] ]);
							},
							ACTION_3: (e) => {
								this.props.enableFormFiller(this.state.currentSelected);
							},
							ACTION_4: (e) => {
								this.deleteResource([ data[this.state.currentSelected]._id ]);
							}
						};
						[ 1, 2, 3, 4 ].forEach((item) => {
							handlers[`GLOBAL_ACTION_${item}`] = (e) => {
								const evt = new MouseEvent('click', {
									bubbles: true,
									cancelable: true,
									view: window
								});
								GLOBAL_ICONS[`GLOBAL_ACTION_${item}`].dispatchEvent(evt);
							};
						});
						return (
							<Fragment>
								{EffectorTopBar}
								<div className={`Displayer_data Displayer_data-${view}`}>
									<HotKeys keyMap={keyMap} handlers={handlers}>
										{decideDisplayer(manipulatedData, view, difference(cols, removed_cols), setSelectedIndex)}
									</HotKeys>
								</div>
								{EffectorBottomBar}
							</Fragment>
						);
					}}
				</Effector>
			</div>
		);
	}
}

export default withTheme(Displayer);
