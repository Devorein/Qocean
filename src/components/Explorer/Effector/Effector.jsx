import React, { Component, Fragment } from 'react';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import GetAppIcon from '@material-ui/icons/GetApp';
import StarIcon from '@material-ui/icons/Star';
import PublicIcon from '@material-ui/icons/Public';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import pluralize from 'pluralize';
import download from '../../../Utils/download';
import shaveData from '../../../Utils/shaveData';
import shortid from 'shortid';
import ModalRP from '../../../RP/ModalRP';
import { AppContext } from '../../../context/AppContext';

class Effector extends Component {
	static contextType = AppContext;

	renderEffectorBottomBar = () => {
		const { totalCount } = this.props;
		return <div>{totalCount}</div>;
	};

	updateResource = (selectedRows, field) => {
		selectedRows = selectedRows.map((row) => ({ id: row._id, body: { [field]: !row[field] } }));
		let { type } = this.state;
		type = pluralize(type, 2).toLowerCase();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}`,
				{
					[type]: selectedRows
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data: updatedDatas } }) => {
				this.context.changeResponse('Success', `Successfully updated ${updatedDatas.length} ${type}`);
				this.setState({
					data: this.state.data.map((data) => {
						const updatedData = updatedDatas.find((updatedData) => updatedData._id === data._id);
						if (updatedData) data[field] = updatedData[field];
						return data;
					})
				});
			});
	};

	transformData = (data) => {
		let { type } = this.state;
		type = type.toLowerCase();

		if (type === 'question') {
			return axios
				.put(
					'http://localhost:5001/api/v1/questions/_/answers',
					{
						questions: data.map(({ _id }) => _id)
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
				.then(({ data: { data: answers } }) => {
					const dataWithAnswers = data.map((data, index) => ({ ...data, answers: answers[index].answers }));
					return shaveData(dataWithAnswers, type);
				});
		} else return new Promise((resolve, reject) => resolve(shaveData(data, type)));
	};

	renderGlobalEffectors = () => {
		const { updateResource, transformData } = this;
		const { data, page, refetchData } = this.props;
		if (page === 'Self') {
			return (
				<div>
					<RotateLeftIcon
						onClick={(e) => {
							refetchData();
						}}
					/>
					<StarIcon
						onClick={(e) => {
							updateResource(data, 'favourite');
						}}
					/>
					<PublicIcon
						onClick={(e) => {
							updateResource(data, 'public');
						}}
					/>
					<GetAppIcon
						onClick={(e) => {
							transformData(data).then((data) => {
								download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
							});
						}}
					/>
				</div>
			);
		}
	};

	deleteResource = (selectedRows) => {
		const { type } = this.state;
		const deleteResources = (selectedRows) => {
			const target = pluralize(type, 2).toLowerCase();
			return axios.delete(`http://localhost:5001/api/v1/${target}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					[target]: selectedRows
				}
			});
		};

		if (type === 'Environment') {
			let containsCurrent = false;
			const temp = [];
			selectedRows.forEach((selectedRow) => {
				if (selectedRow === this.props.user.current_environment._id) containsCurrent = true;
				else temp.push(selectedRow);
			});
			if (containsCurrent) {
				this.context.changeResponse(
					'Cant delete',
					'You are trying to delete a currently activated environment',
					'error'
				);
			}
			if (selectedRows.length > 1)
				deleteResources(temp).then(({ data: { data } }) => {
					setTimeout(() => {
						this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
					}, 2500);
					this.refetchData();
				});
		} else
			deleteResources(selectedRows).then(({ data: { data } }) => {
				this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
				this.refetchData();
			});
	};

	renderSelectedEffectors = (setDeleteModal) => {
		const { updateResource } = this;
		const { data, page } = this.props;
		const selectedItems = this.props.selectedIndex.map(({ index }) => data[index]);
		if (page === 'Self')
			return (
				<div>
					<DeleteIcon
						onClick={(e) => {
							setDeleteModal(true);
						}}
					/>
					<StarIcon
						onClick={(e) => {
							updateResource(selectedItems, 'favourite');
						}}
					/>
					<PublicIcon
						onClick={(e) => {
							updateResource(selectedItems, 'public');
						}}
					/>
					<GetAppIcon
						onClick={(e) => {
							this.transformData(selectedItems).then((data) => {
								download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
							});
						}}
					/>
				</div>
			);
	};

	renderEffectorTopBar = (setDeleteModal) => {
		return this.props.selectedIndex.length > 0
			? this.renderSelectedEffectors(setDeleteModal)
			: this.renderGlobalEffectors();
	};

	deleteModalMessage = () => {
		const selectedItems = this.props.selectedIndex.map(({ index }) => this.props.data[index]);
		return (
			<Fragment>
				<div>
					Youre about to delete the following {selectedItems.length} {this.props.type.toLowerCase()}(s)
				</div>
				{selectedItems.map((selectedItem) => <div key={selectedItem._id}>{selectedItem.name}</div>)}
			</Fragment>
		);
	};

	render() {
		const { renderEffectorTopBar, renderEffectorBottomBar, deleteModalMessage } = this;
		return (
			<ModalRP
				onClose={(e) => {
					this.setState({
						selectedRows: []
					});
				}}
				onAccept={() => {
					const selectedDatas = this.state.selectedRows.map((index) => this.state.data[index]._id);
					this.deleteResource(selectedDatas);
					this.setState({
						selectedRows: []
					});
				}}
				modalMsg={deleteModalMessage()}
			>
				{({ setIsOpen }) =>
					this.props.children({
						EffectorTopBar: <div className="EffectorTopBar">{renderEffectorTopBar(setIsOpen)}</div>,
						EffectorBottomBar: <div className="EffectorBottomBar">{renderEffectorBottomBar()}</div>
					})}
			</ModalRP>
		);
	}
}

export default Effector;
