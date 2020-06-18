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
import Composer from 'react-composer';

import LocalFilter from '../../FilterSort/LocalFilter';
import ModalRP from '../../../RP/ModalRP';
import Pagination from '../../Pagination/Pagination';
import List from '../../List/List';
import InputSelect from '../../Input/InputSelect';
import MultiSelect from '../../Input/MultiSelect';
import { AppContext } from '../../../context/AppContext';
import exportData from '../../../Utils/exportData';

import './Effector.scss';
class Effector extends Component {
	state = {
		view: this.context.user
			? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_view`].toLowerCase()
			: 'list',
		cols: this.props.cols || [],
		selected_cols: this.props.cols || []
	};

	GLOBAL_ICONS = {};
	static contextType = AppContext;

	// ? Contained selectedIndex
	UNSAFE_componentWillReceiveProps(props) {
		let cols = null,
			selected_cols = this.state.selected_cols;
		if (props.cols.length > 0) {
			cols = props.cols;
			selected_cols = props.cols;
		}
		if (props.type !== this.props.type) {
			selected_cols = [];
		}
		this.setState({
			cols,
			selected_cols
		});
	}

	renderEffectorBottomBar = () => {
		const {
			PaginationPageInput,
			PaginationGoToPageButton,
			PaginationIppSelect,
			PaginationPageCount,
			PaginationItemCount
		} = this;

		return (
			<Fragment>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{PaginationPageInput}
					{PaginationGoToPageButton}
				</div>
				<div className="Effector_Bottombar_container">
					{PaginationIppSelect}
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
					{PaginationPageCount}
					{PaginationItemCount}
				</div>
			</Fragment>
		);
	};

	renderGlobalEffectors = () => {
		const { updateResource } = this.props;
		const { filteredContents } = this;
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
						exportData(type, filteredContents);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon
					key={'addtobucket'}
					onClick={this.props.customHandlers.add.bind(null, this.props.data.map((item) => item._id))}
				/>
			) : null
		];
		const array = Array(filteredContents.length).fill(0).map((_, i) => i);
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
		return <div className="Effector_Topbar_globals">{effectors.map((eff) => eff)}</div>;
	};

	renderSelectedEffectors = () => {
		const { updateResource } = this.props;
		const { filteredContents, checked } = this;
		let { page, type } = this.props;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const selectedItems = checked.map((index) => filteredContents[index]);
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
						this.props.watchToggle(checked);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon
					key={'addtobucketselected'}
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
						updateResource(checked, 'favourite');
					}}
				/>,
				<PublicIcon
					key={'public'}
					ref={(ref) => {
						this.GLOBAL_ICONS.GLOBAL_ACTION_3 = ref;
					}}
					onClick={(e) => {
						updateResource(checked, 'public');
					}}
				/>
			);
		}
		return <div className="Effector_Topbar_selected">{effectors.map((eff) => eff)}</div>;
	};

	renderEffectorTopBar = () => {
		const { checked } = this;
		return (
			<Fragment>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{this.AllCheckbox}
					{this.SelectStat}
				</div>
				<InputSelect
					className="Effector_Topbar_view"
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
					labelClass="Effector_Topbar_properties"
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
				<div className="Effector_Topbar_hidden">{this.props.data.length - this.filteredContents.length} hidden</div>
				{this.LocalFilterSearch}
				{checked.length > 0 ? this.renderSelectedEffectors() : this.renderGlobalEffectors()}
			</Fragment>
		);
	};

	deleteModalMessage = (selectedItems) => {
		const { type } = this.props;
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
		const { selected_cols, view, itemsPerPage, currentPage } = this.state;
		return (
			<Composer
				components={[
					<Pagination
						prefix={'Effector_Bottombar'}
						filter_sort={this.props.filter_sort}
						refetchData={this.props.refetchData}
						totalCount={this.props.totalCount}
						page={this.props.page}
					/>,
					<LocalFilter data={this.props.data} className="Effector_Topbar_search" />,
					({ results, render }) => (
						<List prefix={'Effector_Topbar'} totalItems={results[1].filteredContents.length} children={render} />
					),
					({ results, render }) => {
						const selectedDatas = results[2].checked.map((index) => results[1].filteredContents[index]);
						return (
							<ModalRP
								onAccept={() => {
									this.props.deleteResource(selectedDatas.map(({ _id }) => _id));
									results[2].resetChecked();
								}}
								modalMsg={deleteModalMessage(selectedDatas)}
								children={render}
							/>
						);
					}
				]}
			>
				{(ComposedProps) => {
					ComposedProps.forEach((ComposedProp) => {
						Object.entries(ComposedProp).forEach(([ key, value ]) => (this[key] = value));
					});

					const style = {
						backgroundColor: Color.rgb(convert.hex.rgb(this.props.theme.palette.background.dark)).darken(0.15).hex()
					};
					return this.props.children({
						removed_cols: difference(this.props.cols, selected_cols),
						selectedIndex: this.checked,
						view,
						setSelectedIndex: this.setSelectedIndex,
						EffectorTopBar: (
							<div className="Effector_Topbar" style={style}>
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
						currentPage,
						filteredContents: this.filteredContents
					});
				}}
			</Composer>
		);
	}
}

export default withTheme(Effector);
