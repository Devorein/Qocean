import React, { Component, Fragment } from 'react';
import { withTheme } from '@material-ui/core/styles';
import Composer from 'react-composer';

import Icon from '../../../components/Icon/Icon';
import LocalFilter from '../../FilterSort/LocalFilter';
import ModalRP from '../../../RP/ModalRP';
import Pagination from '../../Pagination/Pagination';
import DataView from '../../DataView/DataView';
import List from '../../List/List';
import ColList from '../../List/ColList';
import DataTransformer from '../../DataTransformer/DataTransformer';
import ActionShortcut from '../../ActionShortcut/ActionShortcut';

import { AppContext } from '../../../context/AppContext';
import exportData from '../../../Utils/exportData';
import sectorizeData from '../../../Utils/sectorizeData';
import filterSort from '../../../Utils/filterSort';

import './Effector.scss';

class Effector extends Component {
	GLOBAL_ICONS = {};
	static contextType = AppContext;

	cloneIcons = (effectors) => {
		return effectors.map((eff, index) => {
			if (eff)
				return (
					<Icon
						{...eff}
						key={`${this.props.page}${index}${eff.icon}`}
						iconRef={(ref) => (this.GLOBAL_ICONS[`GLOBAL_ACTION_${index + 1}`] = ref)}
					/>
				);
			return null;
		});
	};

	renderEffectorBottomBar = () => {
		const {
			PaginationPageInput,
			PaginationGoToPageButton,
			PaginationIppSelect,
			PaginationPageCount,
			PaginationItemCount
		} = this;
		const style = {
			backgroundColor: this.props.theme.darken(this.props.theme.palette.background.dark, 0.15)
		};
		return (
			<div className="Effector_Bottombar" style={style}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{PaginationPageInput}
					{PaginationGoToPageButton}
				</div>
				<div className="Effector_Bottombar_container">
					{PaginationIppSelect}
					<div className="Effector_Bottombar-pagenavigation">
						<Icon
							icon="ChevronLeft"
							onCLick={() => {
								this.movePage('prev');
							}}
							popoverText="Go to prev page"
						/>
						<Icon
							icon="ChevronRight"
							onCLick={() => {
								this.movePage('next');
							}}
							popoverText="Go to next page"
						/>
					</div>
					{PaginationPageCount}
					{PaginationItemCount}
				</div>
			</div>
		);
	};

	renderGlobalEffectors = () => {
		const { updateResource } = this.props;
		const { filteredContents } = this;
		let { page, type } = this.props;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const effectors = [
			{ icon: 'RotateLeft', onClick: this.refetchData, popoverText: 'Refetch data' },
			type !== 'user' && page !== 'play'
				? {
						icon: 'GetApp',
						onClick: () => {
							exportData(type, filteredContents);
						},
						popoverText: `Export ${filteredContents.length} items`
					}
				: null,
			page === 'play'
				? {
						icon: 'AddCircle',
						onClick: this.props.customHandlers.add.bind(null, this.props.data.map((item) => item._id)),
						popoverText: `Add ${this.props.data.length} items to quiz list`
					}
				: null
		];
		const array = Array(filteredContents.length).fill(0).map((_, i) => i);
		if (page === 'self') {
			effectors.push(
				{
					icon: 'star',
					onClick: () => {
						updateResource(array, 'favourite');
					},
					popoverText: `Reverse toggle favourite ${filteredContents.length} items`
				},
				{
					icon: 'public',
					onClick: () => {
						updateResource(array, 'public');
					},
					popoverText: `Reverse toggle publicize ${filteredContents.length} items`
				}
			);
		} else {
			if (type.match(/(folders|folder|quiz|quizzes)/) && this.context.user && page !== 'play') {
				effectors.push({
					icon: 'Visibility',
					onClick: () => {
						this.props.watchToggle(array);
					},
					popoverText: `Reverse toggle watch ${filteredContents.length} items`
				});
			}
		}
		return <div className="Effector_Topbar_globals">{this.cloneIcons(effectors)}</div>;
	};

	renderSelectedEffectors = () => {
		const { updateResource } = this.props;
		const { filteredContents, checked } = this;
		let { page, type } = this.props;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const selectedItems = checked.map((index) => filteredContents[index]);
		const effectors = [
			type !== 'user' && page !== 'play'
				? {
						icon: 'GetApp',
						onClick: () => {
							exportData(type, selectedItems);
						},
						popoverText: `Export ${checked.length} items`
					}
				: null,
			this.context.user && page !== 'play'
				? {
						icon: 'Visibility',
						onClick: () => {
							this.props.watchToggle(checked);
						},
						popoverText: `Watch toggle ${checked.length} items`
					}
				: null,
			page === 'play'
				? {
						icon: 'AddCircle',
						onClick: this.props.customHandlers.add.bind(null, selectedItems.map((selectedItem) => selectedItem._id)),
						popoverText: `Add ${checked.length} to quiz list`
					}
				: null
		];

		if (page === 'self') {
			effectors.push(
				{
					icon: 'Delete',
					onClick: this.setIsOpen.bind(null, true),
					popoverText: `Delete ${checked.length} items`
				},
				{
					icon: 'Star',
					onClick: () => {
						updateResource(checked, 'favourite');
					},
					popoverText: `Reverse favourite ${checked.length} items`
				},
				{
					icon: 'Public',
					onClick: () => {
						updateResource(checked, 'public');
					},
					popoverText: `Reverse publicize ${checked.length} items`
				}
			);
		}
		return <div className="Effector_Topbar_selected">{this.cloneIcons(effectors)}</div>;
	};

	renderEffectorTopBar = () => {
		const { checked } = this;
		const style = {
			backgroundColor: this.props.theme.darken(this.props.theme.palette.background.dark, 0.15)
		};
		return (
			<div className="Effector_Topbar" style={style}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{this.AllCheckbox}
					{this.SelectStat}
				</div>
				{this.DataViewSelect}
				{this.ColListSelect}
				<div className="Effector_Topbar_hidden">{this.props.data.length - this.filteredContents.length} hidden</div>
				{this.LocalFilterSearch}
				{checked.length > 0 ? this.renderSelectedEffectors() : this.renderGlobalEffectors()}
			</div>
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
		const { type, page, data, filter_sort, refetchData, totalCount } = this.props;
		return (
			<Composer
				components={[
					<Pagination
						prefix={'Effector_Bottombar'}
						filter_sort={filter_sort}
						refetchData={refetchData}
						totalCount={totalCount}
						page={page}
					/>,
					<LocalFilter data={data} LocalFilterSearchClass="Effector_Topbar_search" />,
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
					},
					<DataView displayComponent="displayer" prefix="Effector_Topbar" page={page} />,
					<ColList ColListSelectClass="Effector_Topbar_properties" data={data} page={page} type={type} />,
					({ results, render }) => (
						<DataTransformer
							data={results[1].filteredContents}
							{...this.props}
							checked={results[2].checked}
							selected={results[2].selected}
							handleChecked={results[2].handleChecked}
							children={render}
						/>
					),
					({ results, render }) => <ActionShortcut actions={results[6].LOCAL_ICONS} children={render} />,
					<ActionShortcut actions={this.GLOBAL_ICONS} prefix={'shift'} />
				]}
			>
				{(ComposedProps) => {
					ComposedProps.forEach((ComposedProp) => {
						if (ComposedProp) Object.entries(ComposedProp).forEach(([ key, value ]) => (this[key] = value));
					});
					let { manipulatedData } = this;
					if (manipulatedData)
						manipulatedData = sectorizeData(manipulatedData, type, {
							authenticated: this.context.user,
							blacklist: this.ColListState.removed_cols,
							page,
							flatten: this.DataViewState.view === 'table'
						});

					return this.props.children({
						manipulatedData,
						selected: this.selected,
						view: this.DataViewState.view,
						EffectorTopBar: renderEffectorTopBar(),
						EffectorBottomBar: renderEffectorBottomBar(),
						queryParams: {
							currentPage: this.PaginationState.currentPage,
							limit: this.PaginationState.limit,
							...filterSort(filter_sort)
						}
					});
				}}
			</Composer>
		);
	}
}

export default withTheme(Effector);
