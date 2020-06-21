import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';

import List from './List';
import LocalFilter from '../FilterSort/LocalFilter';
import Icon from '../../components/Icon/Icon';

import './CustomList.scss';

class CustomList extends React.Component {
	renderList = () => {
		const { classes, className, title, containsCheckbox = true, icons } = this.props;
		const { filteredContents } = this;

		const rootClass = clsx(className, classes.listContainer, 'CustomList');
		const { checked, moveUp, moveDown, handleChecked, selected, setSelectedIndex } = this;

		return (
			<div className={rootClass}>
				<div className={clsx('CustomList_Header', classes.Header)}>
					{title ? (
						<h1 variant="h6" className={'CustomList_title'}>
							{title}
						</h1>
					) : null}
					{this.LocalFilterSearch}
					<div className="CustomList_Header_Icons">
						{icons && icons.length !== 0 ? (
							icons.map(({ icon, onClick, popoverText }, index) => {
								return (
									<div key={`${index}`} className={`CustomList_Header_Icons_${icon.displayName}`}>
										<Icon
											icon={icon}
											onClick={onClick.bind(
												null,
												checked.length > 0
													? checked
													: Array(filteredContents.length).fill(0).map((_, i) => filteredContents[i]._id || i)
											)}
											popoverText={popoverText}
										/>
									</div>
								);
							})
						) : null}
						<Icon icon="chevronleft" onClick={moveUp} popoverText="Move up" />
						<Icon icon="chevronright" onClick={moveDown} popoverText="Move down" />

						{this.AllCheckbox}
						{this.SelectStat}
					</div>
				</div>

				<div className={clsx('CustomList_Body', classes.Body)}>
					{filteredContents.map((listItem, index) => {
						const { primary, secondary, primaryIcon } = listItem;
						return (
							<div
								key={listItem._id || `${listItem.primary}${index}`}
								className={clsx(selected === index ? 'selected' : null, classes.BodyItem, 'CustomList_Body_Item')}
								onClick={(e) => {
									setSelectedIndex(index);
								}}
							>
								<div className={'CustomList_Body_Item_index'}>{index + 1}</div>
								{containsCheckbox ? (
									<div onClick={handleChecked.bind(null, index)} className={'CustomList_Body_Item_checkbox'}>
										<Checkbox
											edge="start"
											checked={checked.indexOf(index) !== -1}
											tabIndex={-1}
											disableRipple
											color="primary"
											inputProps={{ 'aria-labelledby': primary }}
										/>
									</div>
								) : null}
								<div className={'CustomList_Body_Item_Icons'}>
									<div className={'CustomList_Body_Item_Icons_primary'}>
										<Icon icon={primaryIcon} />
									</div>
									{icons && icons.length !== 0 ? (
										icons.map(({ icon, onClick, popoverText }) => {
											return (
												<div
													className={`CustomList_Body_Item_Icons_${icon.displayName}`}
													key={listItem._id + icon.displayName}
												>
													<Icon
														icon={icon}
														onClick={onClick.bind(null, [ listItem._id || index ])}
														popoverText={popoverText}
													/>
												</div>
											);
										})
									) : null}
								</div>
								<div className={'CustomList_Body_Item_Content'}>
									<div className={'CustomList_Body_Item_Content_primary'}>{primary}</div>
									<div className={'CustomList_Body_Item_Content_secondary'}>{secondary}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	render() {
		const { renderList } = this;
		return (
			<LocalFilter
				data={this.props.listItems.map((item) => ({ ...item, name: item.primary }))}
				LocalFilterSearchClass="CustomList_Header_search"
				fixedTargetType="string"
				checkAgainst={[ 'name' ]}
			>
				{(props) => {
					Object.entries(props).forEach(([ key, value ]) => (this[key] = value));
					return (
						<List totalItems={this.filteredContents.length} prefix="CustomList">
							{(ListProps) => {
								Object.entries(ListProps).forEach(([ key, value ]) => (this[key] = value));
								return this.props.children
									? this.props.children({
											list: renderList(),
											checked: this.checked,
											selectedIndex: this.selected,
											...ListProps
										})
									: renderList();
							}}
						</List>
					);
				}}
			</LocalFilter>
		);
	}
}

export default withStyles((theme) => ({
	listContainer: {
		background: theme.palette.background.dark,
		'& .MuiListItem-root': {
			'&:hover': {
				background: theme.palette.primary.dark,
				transition: 'background 150ms ease-in-out',
				color: theme.palette.primary.contrastText
			}
		},
		'& .Muidiv-root': {
			color: theme.palette.primary.main
		}
	},
	Header: {
		backgroundColor: theme.palette.background.dark
	},
	Body: {
		background: theme.palette.background.main
	},
	BodyItem: {
		'&.MuiListItem-root': {
			height: 50,
			padding: 5
		},
		'&.selected': {
			backgroundColor: theme.palette.grey['A400']
		}
	}
}))(CustomList);
