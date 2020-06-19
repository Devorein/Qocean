import React, { Component, Fragment } from 'react';
import { withTheme } from '@material-ui/core';
import axios from 'axios';
import pluralize from 'pluralize';

import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import { AppContext } from '../../../context/AppContext';

import exportData from '../../../Utils/exportData';

import CustomSnackbars from '../../Snackbars/CustomSnackbars';
import './Displayer.scss';

class Displayer extends Component {
	static contextType = AppContext;

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

	updateResource = (checked, field) => {
		let { type, data, updateDataLocally } = this.props;
		const updatedRows = checked.map((index) => ({ id: data[index]._id, body: { [field]: !data[index][field] } }));
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
				checked.forEach((index, _index) => {
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

	watchToggle = (checked) => {
		let { type, data, page } = this.props;
		page = page.toLowerCase();
		const ids = checked.map((index) => data[index]._id);
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

	decideDisplayer = () => {
		const { manipulatedData, view, selected } = this;
		const { type, page } = this.props;
		const props = {
			data: manipulatedData,
			type,
			selected,
			page
		};

		if (view === 'table') return <TableDisplayer {...props} />;
		else if (view === 'list') return <ListDisplayer {...props} />;
		else if (view === 'board') return <BoardDisplayer {...props} />;
		else if (view === 'gallery') return <GalleryDisplayer {...props} />;
	};

	render() {
		const { decideDisplayer, updateResource, deleteResource, watchToggle } = this;
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
								{(props) => {
									Object.entries(props).forEach(([ key, value ]) => (this[key] = value));
									{
										/* const handlers = {
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
									 */
									}
									return (
										<Fragment>
											{this.EffectorTopBar}
											<div
												className={`Displayer_data Displayer_data-${this.view}`}
												style={{
													backgroundColor: this.props.theme.palette.background.main
												}}
											>
												{decideDisplayer()}
											</div>
											{this.EffectorBottomBar}
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
