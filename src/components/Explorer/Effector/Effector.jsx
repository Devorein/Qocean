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
import { difference } from 'lodash';
import Color from 'color';
import convert from 'color-convert';

import ModalRP from '../../../RP/ModalRP';
import InputSelect from '../../Input/InputSelect';
import MultiSelect from '../../Input/MultiSelect';
import TextInput from '../../Input/TextInput/TextInput';
import CheckboxInput from '../../Input/Checkbox/CheckboxInput';
import { AppContext } from '../../../context/AppContext';
import GenericButton from '../../Buttons/GenericButton';
import exportData from '../../../Utils/exportData';
import filterSort from '../../../Utils/filterSort';
import decideTargetTypes from '../../../Utils/decideTargetType';
import localFilter from '../../../Utils/localFilter';

import './Effector.scss';
class Effector extends Component {
	state = {
		itemsPerPage: 15,
		currentPage: 1,
		typedPage: 1,
		view: 'list',
		cols: this.props.cols || [],
		selected_cols: this.props.cols || [],
		selectedIndex: [],
		searchInput: ''
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
				<div style={{ display: 'flex', alignItems: 'center' }}>
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
				</div>
				<div className="Effector_bottombar_container">
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
		console.log(page);
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
				<div className="Effector_topbar_hidden">{this.props.data.length - this.filteredData.length} hidden</div>
				<TextInput
					className="Effector_topbar_search"
					name="Search"
					fullWidth={false}
					value={this.state.searchInput}
					onChange={(e) => {
						this.setState({ searchInput: e.target.value });
					}}
				/>
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

	filterData = () => {
		const { searchInput } = this.state;
		const terms = searchInput.split('&');
		let filteredData = this.props.data;
		terms.forEach((term) => {
			const [ prop, mod, value ] = term.split('=');
			if (prop && mod && value && filteredData.length !== 0) {
				const [ targetType, modValues ] = decideTargetTypes(prop, {
					shouldConvertToSelectItems: true,
					shouldConvertToAcronym: true
				});
				if (
					targetType &&
					modValues.includes(mod) &&
					filteredData[0][prop] !== null &&
					filteredData[0][prop] !== undefined
				) {
					filteredData = filteredData.filter((item) =>
						localFilter({
							targetType,
							mod,
							value,
							against: item[prop]
						})
					);
				}
			}
		});
		return filteredData;
	};

	render() {
		const { renderEffectorTopBar, renderEffectorBottomBar, deleteModalMessage } = this;
		const { selected_cols, view, selectedIndex, itemsPerPage, currentPage } = this.state;
		this.filteredData = this.filterData();
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
						backgroundColor: Color.rgb(convert.hex.rgb(this.props.theme.palette.background.dark)).darken(0.15).hex()
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
							<div className="Effector_bottombar" style={style}>
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
	}
}

export default withTheme(Effector);
