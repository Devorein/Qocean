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
import InputSelect from '../../Input/InputSelect';
import MultiSelect from '../../Input/MultiSelect';
import TextInput from '../../Input/TextInput/TextInput';
import { AppContext } from '../../../context/AppContext';
import GenericButton from '../../Buttons/GenericButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CheckboxInput from '../../Input/Checkbox/CheckboxInput';
import { difference } from 'lodash';

import './Effector.scss';
class Effector extends Component {
	state = {
		itemsPerPage: 15,
		currentPage: 1,
		typedPage: 1,
		view: 'list',
		cols: this.props.cols || [],
		selected_cols: this.props.cols || []
	};
	static contextType = AppContext;

	UNSAFE_componentWillReceiveProps(props) {
		if (props.cols.length > 0)
			this.setState({
				cols: props.cols,
				selected_cols: props.cols
			});
	}
	refetchData = () => {
		const { itemsPerPage, currentPage } = this.state;
		this.props.refetchData(null, {
			limit: itemsPerPage,
			page: currentPage
		});
	};

	renderEffectorBottomBar = () => {
		const { totalCount } = this.props;
		const { itemsPerPage, currentPage, typedPage } = this.state;
		const maxPage = Math.ceil(totalCount / itemsPerPage);
		return (
			<Fragment>
				<TextInput
					className="Effector_bottombar-pageinput"
					type="number"
					name="Go to page"
					value={typedPage}
					onChange={(e) => {
						this.setState({ typedPage: e.target.value });
					}}
					inputProps={{ max: maxPage }}
				/>
				<GenericButton
					className="Effector_bottombar-pagebutton"
					text={'Go to page'}
					onClick={(e) => {
						if (currentPage !== typedPage) {
							this.setState(
								{
									currentPage: typedPage
								},
								() => {
									this.refetchData();
								}
							);
						}
					}}
					disabled={typedPage > maxPage}
				/>

				<InputSelect
					className="Effector_bottombar-itemselect"
					name="Items Per Page"
					value={itemsPerPage}
					onChange={(e) => {
						this.setState({ itemsPerPage: e.target.value }, () => {
							this.refetchData();
						});
					}}
					selectItems={[ 5, 10, 15, 20, 25, 30, 40, 50, 100 ].map((value) => ({ value, text: value }))}
				/>
				<div className="Effector_bottombar-pagenavigation">
					<ChevronLeftIcon
						onClick={(e) => {
							if (currentPage > 1) {
								this.setState(
									{
										currentPage: currentPage - 1
									},
									() => {
										this.refetchData();
									}
								);
							}
						}}
					/>
					<ChevronRightIcon
						onClick={(e) => {
							if (currentPage < maxPage) {
								this.setState(
									{
										currentPage: currentPage + 1
									},
									() => {
										this.refetchData();
									}
								);
							}
						}}
					/>
				</div>
				<div className="Effector_bottombar-itemcount">
					{itemsPerPage * (currentPage - 1) + 1}-{totalCount <= itemsPerPage ? (
						totalCount
					) : (
						itemsPerPage * currentPage
					)}{' '}
					of {totalCount}
				</div>
			</Fragment>
		);
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
					return shaveData(dataWithAnswers, type, { purpose: 'download' });
				});
		} else return new Promise((resolve, reject) => resolve(shaveData(data, type, { purpose: 'download' })));
	};

	renderGlobalEffectors = () => {
		const { updateResource, transformData } = this;
		const { data, page, refetchData } = this.props;
		if (page === 'Self') {
			return (
				<div className="Effector_topbar_globals">
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
		const selectedItems = this.props.selectedIndex.map((index) => data[index]);
		if (page === 'Self')
			return (
				<div className="Effector_topbar_selected">
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
		return (
			<Fragment>
				<InputSelect
					className="Effector_topbar_view"
					name="Data view"
					value={this.state.view}
					onChange={(e) => {
						this.setState({ view: e.target.value });
					}}
					selectItems={[ 'table', 'list', 'board', 'gallery' ].map((value) => ({
						value,
						text: value.charAt(0).toUpperCase() + value.substr(1)
					}))}
				/>
				<MultiSelect
					customRenderValue={(selected) => `${selected.length} Shown`}
					useSwitch={true}
					className="Effector_topbar_properties"
					name="Toggle Properties"
					selected={this.state.selected_cols}
					handleChange={(e) => {
						this.setState({
							selected_cols: e.target.value
						});
					}}
					items={this.state.cols.map((col) => ({
						_id: col,
						name: col.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
					}))}
				/>
				{this.props.selectedIndex.length > 0 ? (
					this.renderSelectedEffectors(setDeleteModal)
				) : (
					this.renderGlobalEffectors()
				)}
			</Fragment>
		);
	};

	deleteModalMessage = () => {
		const { selectedIndex, data, type } = this.props;
		const selectedItems = selectedIndex.map((index) => data[index]);
		return (
			<Fragment>
				<div>
					Youre about to delete the following {selectedItems.length} {type.toLowerCase()}(s)
				</div>
				{selectedItems.map((selectedItem) => <div key={selectedItem._id}>{selectedItem.name}</div>)}
			</Fragment>
		);
	};

	render() {
		const { renderEffectorTopBar, renderEffectorBottomBar, deleteModalMessage } = this;
		const { selected_cols, view } = this.state;
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
						removed_cols: difference(this.props.cols, selected_cols),
						view,
						EffectorTopBar: <div className="Effector_topbar">{renderEffectorTopBar(setIsOpen)}</div>,
						EffectorBottomBar: <div className="Effector_bottombar">{renderEffectorBottomBar()}</div>
					})}
			</ModalRP>
		);
	}
}

export default Effector;
