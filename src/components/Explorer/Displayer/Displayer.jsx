import React, { Component, Fragment } from 'react';
import { withTheme } from '@material-ui/core';
import { difference } from 'lodash';
import axios from 'axios';
import pluralize from 'pluralize';
import { HotKeys } from 'react-hotkeys';

import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';

import exportData from '../../../Utils/exportData';
import filterSort from '../../../Utils/filterSort';

import CustomSnackbars from '../../Snackbars/CustomSnackbars';
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

class Displayer extends Component {
	static contextType = AppContext;

	state = {
		currentSelected: 0
	};

	componentDidMount() {
		this.props.refetchData({
			limit: this.context.user
				? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_ipp`]
				: 15,
			page: 1
		});
	}

	headers = {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	};

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
					...this.headers
				}
			)
			.then(({ data: { data: updatedDatas } }) => {
				this.changeResponse('Success', `Successfully updated ${updatedDatas.length} ${type}`);
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
				...this.headers,
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
				this.changeResponse('Cant delete', 'You are trying to delete a currently activated environment', 'error');
			}
			if (selectedRows.length >= 1)
				deleteResources(temp).then(({ data: { data } }) => {
					setTimeout(() => {
						this.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
					}, 2500);
					this.props.refetchData(this.queryParams);
				});
		} else
			deleteResources(selectedRows).then(({ data: { data } }) => {
				this.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
				this.props.refetchData(this.queryParams);
			});
	};

	watchToggle = (selectedIndex) => {
		let { type, data, page } = this.props;
		page = page.toLowerCase();
		const ids = selectedIndex.map((index) => data[index]._id);
		type = pluralize(type, 2).toLowerCase();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}/_/watch${type.charAt(0).toUpperCase() + type.substr(1)}`,
				{
					[type]: ids
				},
				{
					...this.headers
				}
			)
			.then(({ data: { data: count } }) => {
				this.changeResponse('Success', `Successfully toggled watch for ${count} ${type}`, 'success');
				if (page === 'watchlist') {
					data = data.filter(({ _id }) => !ids.includes(_id));
					this.props.updateDataLocally(data);
				} else {
					const { user } = this.context;
					const targetWatchlist = user.watchlist[`watched_${pluralize(type, 2)}`];
					ids.forEach((id) => {
						const index = targetWatchlist.indexOf(id);
						if (index === -1) targetWatchlist.push(id);
						else targetWatchlist.splice(index, 1);
					});
					this.context.updateUserLocally(user);
				}
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

	decideDisplayer = (data, view) => {
		const { type, page } = this.props;
		const props = {
			data,
			type,
			currentSelected: this.state.currentSelected,
			page
		};

		if (view === 'table') return <TableDisplayer {...props} />;
		else if (view === 'list') return <ListDisplayer {...props} />;
		else if (view === 'board') return <BoardDisplayer {...props} />;
		else if (view === 'gallery') return <GalleryDisplayer {...props} />;
	};

	render() {
		const { decideDisplayer, updateResource, deleteResource, watchToggle } = this;
		const { page, type, filter_sort } = this.props;
		return (
			<div className="Displayer">
				<CustomSnackbars>
					{({ changeResponse }) => {
						this.changeResponse = changeResponse;
						return (
							<Effector
								updateResource={updateResource}
								deleteResource={deleteResource}
								watchToggle={watchToggle}
								{...this.props}
							>
								{({
									EffectorTopBar,
									EffectorBottomBar,
									view,
									setSelectedIndex,
									selectedIndex,
									GLOBAL_ICONS,
									removed_cols,
									currentPage,
									limit,
									manipulatedData
								}) => {
									this.queryParams = { currentPage, limit, ...filterSort(filter_sort) };
									if (view !== 'table')
										manipulatedData = sectorizeData(manipulatedData, type, {
											authenticated: this.context.user,
											blacklist: removed_cols,
											page
										});
									else {
										manipulatedData = sectorizeData(manipulatedData, type, {
											authenticated: this.context.user,
											blacklist: removed_cols,
											flatten: true,
											page
										});
									}
									{
										/* const handlers = {
										MOVE_UP: (event) => {
											this.setState({
												currentSelected:
													this.state.currentSelected > 0 ? this.state.currentSelected - 1 : data.length - 1
											});
										},
										MOVE_DOWN: (event) => {
											this.setState({
												currentSelected:
													this.state.currentSelected < data.length - 1 ? this.state.currentSelected + 1 : 0
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
									}); */
									}
									return (
										<Fragment>
											{EffectorTopBar}
											<div
												className={`Displayer_data Displayer_data-${view}`}
												style={{
													backgroundColor: this.props.theme.palette.background.main
												}}
											>
												{/* <HotKeys keyMap={keyMap} handlers={handlers} className="React-hotkeys"> */}
												{decideDisplayer(manipulatedData, view)}
												{/* </HotKeys> */}
											</div>
											{EffectorBottomBar}
										</Fragment>
									);
								}}
							</Effector>
						);
					}}
				</CustomSnackbars>
			</div>
		);
	}
}

export default withTheme(Displayer);
