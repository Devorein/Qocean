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
import filterSort from '../../../Utils/filterSort';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
	GLOBAL_ICONS = {};
	static contextType = AppContext;

	UNSAFE_componentWillReceiveProps(props) {
		let cols = null,
			selectedIndex = this.state.selectedIndex,
			selected_cols = this.state.selected_cols;
		if (props.cols.length > 0) {
			cols = props.cols;
			selected_cols = props.cols;
		}
		if (props.type !== this.props.type) {
			selectedIndex = [];
			selected_cols = [];
		}
		this.setState({
			cols,
			selected_cols,
			selectedIndex
		});
	}

	refetchData = () => {
		const { itemsPerPage, currentPage } = this.state;
		const filterSortQuery = filterSort(this.props.filter_sort);
		this.props.refetchData({
			limit: itemsPerPage,
			page: currentPage,
			...filterSortQuery
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
					inputProps={{ max: maxPage, min: 1 }}
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
					) : itemsPerPage * currentPage <= totalCount ? (
						itemsPerPage * currentPage
					) : (
						totalCount
					)}{' '}
					of {totalCount}
				</div>
			</Fragment>
		);
	};

	renderGlobalEffectors = () => {
		const { data, updateResource } = this.props;
		let { page, type } = this.props;
		page = page.toLowerCase();
		type = type.toLowerCase();

		const effectors = [
			<RotateLeftIcon
				key={'refetch'}
				ref={(ref) => {
					this.GLOBAL_ICONS.GLOBAL_ACTION_1 = ref;
				}}
				onClick={(e) => {
					this.refetchData();
				}}
			/>,
			<GetAppIcon
				key={'export'}
				ref={(ref) => {
					this.GLOBAL_ICONS.GLOBAL_ACTION_4 = ref;
				}}
				onClick={(e) => {
					exportData(type, data);
				}}
			/>
		];
		const array = Array(data.length).fill(0).map((_, i) => i);
		if (page === 'self') {
			effectors.push(
				<StarIcon
					key={'favourite'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_2 = ref;
					}}
					onClick={(e) => {
						updateResource(array, 'favourite');
					}}
				/>,
				<PublicIcon
					key={'public'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_3 = ref;
					}}
					onClick={(e) => {
						updateResource(array, 'public');
					}}
				/>
			);
		} else {
			if (type.match(/(folders|folder|quiz|quizzes)/)) {
				effectors.push(
					<VisibilityIcon
						key={'watch'}
						onClick={(e) => {
							this.props.watchToggle(array);
						}}
					/>
				);
			}
		}
		return <div className="Effector_topbar_globals">{effectors.map((eff) => eff)}</div>;
	};

	renderSelectedEffectors = (setDeleteModal) => {
		const { data, updateResource } = this.props;
		let { page, type } = this.props;
		const { selectedIndex } = this.state;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const selectedItems = selectedIndex.map((index) => data[index]);
		const effectors = [
			<GetAppIcon
				key={'export'}
				ref={(ref) => {
					this.GLOBAL_ICONS.GLOBAL_ACTION_4 = ref;
				}}
				onClick={(e) => {
					exportData(type, selectedItems);
				}}
			/>,
			<VisibilityIcon
				key={'watch'}
				onClick={(e) => {
					this.props.watchToggle(selectedIndex);
				}}
			/>
		];

		if (page === 'self') {
			effectors.push(
				<DeleteIcon
					key={'delete'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_1 = ref;
					}}
					onClick={(e) => {
						setDeleteModal(true);
					}}
				/>,
				<StarIcon
					key={'favourite'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_2 = ref;
					}}
					onClick={(e) => {
						updateResource(selectedIndex, 'favourite');
					}}
				/>,
				<PublicIcon
					key={'public'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_3 = ref;
					}}
					onClick={(e) => {
						updateResource(selectedIndex, 'public');
					}}
				/>
			);
		}
		return <div className="Effector_topbar_selected">{effectors.map((eff) => eff)}</div>;
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
					selected={this.state.cols ? this.state.selected_cols : []}
					handleChange={(e) => {
						this.setState({
							selected_cols: e.target.value
						});
					}}
					items={
						this.state.cols ? (
							this.state.cols.map((col) => ({
								_id: col,
								name: col.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
							}))
						) : (
							[]
						)
					}
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
		const { selected_cols, view, selectedIndex, itemsPerPage, currentPage } = this.state;
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
						selectedIndex,
						view,
						setSelectedIndex: this.setSelectedIndex,
						EffectorTopBar: <div className="Effector_topbar">{renderEffectorTopBar(setIsOpen)}</div>,
						EffectorBottomBar: <div className="Effector_bottombar">{renderEffectorBottomBar()}</div>,
						GLOBAL_ICONS: this.GLOBAL_ICONS,
						limit: itemsPerPage,
						page: currentPage
					})}
			</ModalRP>
		);
	}
}

export default Effector;
