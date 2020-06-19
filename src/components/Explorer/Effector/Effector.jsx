import React, { Component, Fragment } from 'react';
import { RotateLeft } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import StarIcon from '@material-ui/icons/Star';
import PublicIcon from '@material-ui/icons/Public';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { withTheme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Composer from 'react-composer';

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
			if (eff) {
				const clonedEff = React.cloneElement(eff, {
					...eff.props,
					key: `${eff.type.displayName}${index}`,
					ref: (ref) => (this.GLOBAL_ICONS[`GLOBAL_${eff.type.displayName}`] = ref)
				});
				return clonedEff;
			}
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
			<RotateLeft
				onClick={(e) => {
					this.refetchData();
				}}
			/>,
			type !== 'user' && page !== 'play' ? (
				<GetAppIcon
					onClick={(e) => {
						exportData(type, filteredContents);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon onClick={this.props.customHandlers.add.bind(null, this.props.data.map((item) => item._id))} />
			) : null
		];
		const array = Array(filteredContents.length).fill(0).map((_, i) => i);
		if (page === 'self') {
			effectors.push(
				<StarIcon
					onClick={(e) => {
						updateResource(array, 'favourite');
					}}
				/>,
				<PublicIcon
					onClick={(e) => {
						updateResource(array, 'public');
					}}
				/>
			);
		} else {
			if (type.match(/(folders|folder|quiz|quizzes)/) && this.context.user && page !== 'play') {
				effectors.push(
					<VisibilityIcon
						onClick={(e) => {
							this.props.watchToggle(array);
						}}
					/>
				);
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
			type !== 'user' && page !== 'play' ? (
				<GetAppIcon
					onClick={(e) => {
						exportData(type, selectedItems);
					}}
				/>
			) : null,
			this.context.user && page !== 'play' ? (
				<VisibilityIcon
					onClick={(e) => {
						this.props.watchToggle(checked);
					}}
				/>
			) : null,
			page === 'play' ? (
				<AddCircleIcon
					onClick={this.props.customHandlers.add.bind(null, selectedItems.map((selectedItem) => selectedItem._id))}
				/>
			) : null
		];

		if (page === 'self') {
			effectors.push(
				<DeleteIcon
					onClick={(e) => {
						this.setIsOpen(true);
					}}
				/>,
				<StarIcon
					onClick={(e) => {
						updateResource(checked, 'favourite');
					}}
				/>,
				<PublicIcon
					onClick={(e) => {
						updateResource(checked, 'public');
					}}
				/>
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
						GLOBAL_ICONS: this.GLOBAL_ICONS,
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
