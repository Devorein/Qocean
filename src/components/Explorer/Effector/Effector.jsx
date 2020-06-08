import React, { Component, Fragment } from 'react';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import GetAppIcon from '@material-ui/icons/GetApp';
import StarIcon from '@material-ui/icons/Star';
import PublicIcon from '@material-ui/icons/Public';
import DeleteIcon from '@material-ui/icons/Delete';
import ModalRP from '../../../RP/ModalRP';
import InputSelect from '../../Input/InputSelect';
import MultiSelect from '../../Input/MultiSelect';
import TextInput from '../../Input/TextInput/TextInput';
import CheckboxInput from '../../Input/Checkbox/CheckboxInput';
import { AppContext } from '../../../context/AppContext';
import GenericButton from '../../Buttons/GenericButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { difference } from 'lodash';
import exportData from '../../../Utils/exportData';

import './Effector.scss';
class Effector extends Component {
	state = {
		itemsPerPage: 15,
		currentPage: 1,
		typedPage: 1,
		view: 'list',
		cols: this.props.cols || [],
		selected_cols: this.props.cols || [],
		selectedIndex: []
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
				<div>
					Pg. {currentPage} of {maxPage}
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

	renderGlobalEffectors = () => {
		const { data, page, refetchData, type, updateResource } = this.props;
		const { itemsPerPage, currentPage } = this.state;

		if (page === 'Self') {
			return (
				<div className="Effector_topbar_globals">
					<RotateLeftIcon
						onClick={(e) => {
							refetchData(null, {
								page: currentPage,
								limit: itemsPerPage
							});
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
							exportData(type, data);
						}}
					/>
				</div>
			);
		}
	};

	renderSelectedEffectors = (setDeleteModal) => {
		const { data, page, type, updateResource } = this.props;
		const selectedItems = this.state.selectedIndex.map((index) => data[index]);
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
							exportData(type, selectedItems);
						}}
					/>
				</div>
			);
	};

	renderEffectorTopBar = (setDeleteModal) => {
		const { data } = this.props;

		const { selectedIndex } = this.state;
		return (
			<Fragment>
				<CheckboxInput
					className="Effector_topbar_toggleall"
					checked={selectedIndex.length === data.length}
					onChange={(e) => {
						const { shiftKey, altKey } = e.nativeEvent;
						let newIndex = null;
						if (shiftKey && altKey)
							newIndex = difference(Array(data.length).fill(0).map((_, index) => index), this.state.selectedIndex);
						else if (shiftKey) newIndex = [];
						else {
							if (!e.target.checked) newIndex = [];
							else newIndex = Array(data.length).fill(0).map((_, index) => index);
						}
						this.setState({
							selectedIndex: newIndex
						});
					}}
				/>
				<div className="Effector_topbar_selectstat">
					{selectedIndex.length}/{data.length}
				</div>
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
					customRenderValue={(selected) => `${selected ? selected.length : 0} Shown`}
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
				{selectedIndex.length > 0 ? this.renderSelectedEffectors(setDeleteModal) : this.renderGlobalEffectors()}
			</Fragment>
		);
	};

	deleteModalMessage = () => {
		const { data, type } = this.props;
		const { selectedIndex } = this.state;
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

	setSelectedIndex = (index, useGiven = false) => {
		let { selectedIndex } = this.state;
		if (useGiven) selectedIndex = index;
		else {
			if (selectedIndex.includes(index)) selectedIndex = selectedIndex.filter((_index) => index !== _index);
			else selectedIndex.push(index);
		}
		this.setState({
			selectedIndex
		});
	};

	render() {
		const { renderEffectorTopBar, renderEffectorBottomBar, deleteModalMessage } = this;
		const { selected_cols, view, selectedIndex } = this.state;
		return (
			<ModalRP
				onAccept={() => {
					const selectedDatas = selectedIndex.map((index) => this.props.data[index]._id);
					this.props.deleteResource(selectedDatas);
					this.setState({
						selectedIndex: []
					});
				}}
				modalMsg={deleteModalMessage()}
			>
				{({ setIsOpen }) =>
					this.props.children({
						removed_cols: difference(this.props.cols, selected_cols),
						view,
						selectedIndex,
						setSelectedIndex: this.setSelectedIndex,
						EffectorTopBar: <div className="Effector_topbar">{renderEffectorTopBar(setIsOpen)}</div>,
						EffectorBottomBar: <div className="Effector_bottombar">{renderEffectorBottomBar()}</div>
					})}
			</ModalRP>
		);
	}
}

export default Effector;
