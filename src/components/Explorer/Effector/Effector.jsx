import React, { Component, Fragment } from 'react';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import GetAppIcon from '@material-ui/icons/GetApp';
import StarIcon from '@material-ui/icons/Star';
import PublicIcon from '@material-ui/icons/Public';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { withTheme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { difference } from 'lodash';
import Color from 'color';
import convert from 'color-convert';
import shortid from 'shortid';

import LocalFilter from '../../FilterSort/LocalFilter';
import ModalRP from '../../../RP/ModalRP';
import InputSelect from '../../Input/InputSelect';
import MultiSelect from '../../Input/MultiSelect';
import CheckboxInput from '../../Input/Checkbox/CheckboxInput';
import { AppContext } from '../../../context/AppContext';
import exportData from '../../../Utils/exportData';
import Pagination from '../../Pagination/Pagination';

import './Effector.scss';
class Effector extends Component {
	state = {
		view: this.context.user
			? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_view`].toLowerCase()
			: 'list',
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

	renderEffectorBottomBar = () => {
		const { PageInput, GoToPageButton, IppSelect, PageCount, ItemCount } = this;

		return (
			<Fragment>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{PageInput}
					{GoToPageButton}
				</div>
				<div className="Effector_Bottombar_container">
					{IppSelect}
					<div className="Effector_Bottombar-pagenavigation">
						<ChevronLeftIcon
							onClick={(e) => {
								this.movePage('prev');
							}}
						/>
						<ChevronRightIcon
							onClick={(e) => {
								this.movePage('next');
							}}
						/>
					</div>
					{PageCount}
					{ItemCount}
				</div>
			</Fragment>
		);
	};

	renderGlobalEffectors = () => {
		const { updateResource } = this.props;
		const { filteredData } = this;
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
			type !== 'user' && page !== 'play' ? (
				<GetAppIcon
					key={'export'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_4 = ref;
					}}
					onClick={(e) => {
						exportData(type, filteredData);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon
					key={shortid.generate()}
					onClick={this.props.customHandlers.add.bind(null, this.props.data.map((item) => item._id))}
				/>
			) : null
		];
		const array = Array(filteredData.length).fill(0).map((_, i) => i);
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
			if (type.match(/(folders|folder|quiz|quizzes)/) && this.context.user && page !== 'play') {
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

	renderSelectedEffectors = () => {
		const { updateResource } = this.props;
		const { filteredData } = this;
		let { page, type } = this.props;
		const { selectedIndex } = this.state;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const selectedItems = selectedIndex.map((index) => filteredData[index]);
		const effectors = [
			type !== 'user' && page !== 'play' ? (
				<GetAppIcon
					key={'export'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_4 = ref;
					}}
					onClick={(e) => {
						exportData(type, selectedItems);
					}}
				/>
			) : null,
			this.context.user && page !== 'play' ? (
				<VisibilityIcon
					key={'watch'}
					onClick={(e) => {
						this.props.watchToggle(selectedIndex);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon
					key={shortid.generate()}
					onClick={this.props.customHandlers.add.bind(null, selectedItems.map((selectedItem) => selectedItem._id))}
				/>
			) : null
		];

		if (page === 'self') {
			effectors.push(
				<DeleteIcon
					key={'delete'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_1 = ref;
					}}
					onClick={(e) => {
						this.setIsOpen(true);
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

	renderEffectorTopBar = () => {
		const { filteredData } = this;

		const { selectedIndex } = this.state;
		return (
			<Fragment>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<CheckboxInput
						className="Effector_topbar_toggleall"
						checked={selectedIndex.length === filteredData.length}
						onChange={(e) => {
							const { shiftKey, altKey } = e.nativeEvent;
							let newIndex = null;
							if (shiftKey && altKey)
								newIndex = difference(
									Array(filteredData.length).fill(0).map((_, index) => index),
									this.state.selectedIndex
								);
							else if (shiftKey) newIndex = [];
							else {
								if (!e.target.checked) newIndex = [];
								else newIndex = Array(filteredData.length).fill(0).map((_, index) => index);
							}
							this.setState({
								selectedIndex: newIndex
							});
						}}
					/>
					<div className="Effector_topbar_selectstat">
						{selectedIndex.length}/{filteredData.length}
					</div>
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
					labelClass="Effector_topbar_properties"
					name="Toggle Properties"
					selected={this.state.cols ? this.state.selected_cols : []}
					handleChange={(e, child) => {
						let selected_cols = e.target.value;
						if (e.altKey) selected_cols = [ child.props.value ];
						else if (e.shiftKey) {
							const { menuitem } = child.props;
							selected_cols = [];
							Array(menuitem + 1).fill(0).forEach((_, index) => selected_cols.push(this.state.cols[index]));
						}
						this.setState({
							selected_cols
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
				<div className="Effector_topbar_hidden">{this.props.data.length - this.filteredData.length} hidden</div>
				{this.LocalFilterSearch}
				{selectedIndex.length > 0 ? this.renderSelectedEffectors() : this.renderGlobalEffectors()}
			</Fragment>
		);
	};

	deleteModalMessage = () => {
		const { type } = this.props;
		const { filteredData } = this;
		const { selectedIndex } = this.state;
		const selectedItems = selectedIndex.map((index) => filteredData[index]);
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
			<Pagination
				prefix={'Effector_Bottombar'}
				filter_sort={this.props.filter_sort}
				refetchData={this.props.refetchData}
				totalCount={this.props.totalCount}
				page={this.props.page}
			>
				{(props) => {
					Object.entries(props).forEach(([ key, value ]) => (this[key] = value));
					return (
						<LocalFilter data={this.props.data} className="Effector_topbar_search">
							{({ LocalFilterSearch, filteredContents }) => {
								this.filteredData = filteredContents;
								this.LocalFilterSearch = LocalFilterSearch;
								return (
									<ModalRP
										onAccept={() => {
											const selectedDatas = selectedIndex.map((index) => this.filteredData[index]._id);
											this.props.deleteResource(selectedDatas);
											this.setState({
												selectedIndex: []
											});
										}}
										modalMsg={deleteModalMessage()}
									>
										{({ setIsOpen }) => {
											const style = {
												backgroundColor: Color.rgb(convert.hex.rgb(this.props.theme.palette.background.dark))
													.darken(0.15)
													.hex()
											};
											this.setIsOpen = setIsOpen;
											return this.props.children({
												removed_cols: difference(this.props.cols, selected_cols),
												selectedIndex,
												view,
												setSelectedIndex: this.setSelectedIndex,
												EffectorTopBar: (
													<div className="Effector_topbar" style={style}>
														{renderEffectorTopBar()}
													</div>
												),
												EffectorBottomBar: (
													<div className="Effector_Bottombar" style={style}>
														{renderEffectorBottomBar()}
													</div>
												),
												GLOBAL_ICONS: this.GLOBAL_ICONS,
												limit: itemsPerPage,
												page: currentPage,
												filteredData: this.filteredData
											});
										}}
									</ModalRP>
								);
							}}
						</LocalFilter>
					);
				}}
			</Pagination>
		);
	}
}

export default withTheme(Effector);
