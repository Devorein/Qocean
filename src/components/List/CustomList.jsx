import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import shortid from 'shortid';

import getIcons from '../../Utils/getIcons';
import List from './List';

import './CustomList.scss';

class CustomList extends React.Component {
	state = {
		manipulated: false,
		filteredItems: this.props.listItems || []
	};

	UNSAFE_componentWillReceiveProps(props) {
		this.setState({
			filteredItems: props.listItems
		});
	}

	filterList = (e) => {
		this.setState({
			filteredItems: this.props.listItems.filter(({ primary }) => primary.includes(e.target.value)),
			manipulated: true
		});
	};

	renderList = () => {
		const { filterList } = this;

		const { classes, className, title, containsCheckbox = true, icons, listItems } = this.props;
		const { manipulated, filteredItems } = this.state;

		const items = manipulated ? filteredItems : listItems;
		const rootClass = clsx(className, classes.listContainer, 'CustomList');

		const { checked, moveUp, moveDown, handleChecked, handleCheckedAll, selectedIndex, setSelectedIndex } = this;
		return (
			<div className={rootClass}>
				<div className={clsx('CustomList_Header', classes.Header)}>
					{title ? (
						<h1 variant="h6" className={'CustomList_title'}>
							{title}
						</h1>
					) : null}
					<TextField onChange={filterList} className="CustomList_Header_search" />
					<div className="CustomList_Header_Icons">
						{icons && icons.length !== 0 ? (
							icons.map(({ icon, onClick }) => {
								return (
									<div key={shortid.generate()} className={`CustomList_Header_Icons_${icon.displayName}`}>
										{React.createElement(icon, {
											onClick: onClick.bind(
												null,
												(checked.length > 0 ? checked : Array(items.length).fill(0).map((_, i) => i)).map(
													(index) => items[index]._id || index
												)
											)
										})}
									</div>
								);
							})
						) : null}

						<ChevronLeftIcon onClick={moveUp} />
						<ChevronRightIcon onClick={moveDown} />
						<div onClick={handleCheckedAll} className={'CustomList_Header_toggle'}>
							<Checkbox
								edge="start"
								checked={checked.length === items.length && items.length !== 0}
								tabIndex={-1}
								disableRipple
								color="primary"
								inputProps={{ 'aria-labelledby': 'Select All' }}
							/>
						</div>
						<div className={'CustomList_Header_checked'}>
							{checked.length} / {items.length}
						</div>
					</div>
				</div>

				<div className={clsx('CustomList_Body', classes.Body)}>
					{items.map((listItem, index) => {
						const { primary, secondary, primaryIcon } = listItem;
						return (
							<div
								key={listItem._id || `${listItem.primary}${index}`}
								className={clsx(selectedIndex === index ? 'selected' : null, classes.BodyItem, 'CustomList_Body_Item')}
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
									<div className={'CustomList_Body_Item_Icons_primary'}>{getIcons(primaryIcon)}</div>
									{icons && icons.length !== 0 ? (
										icons.map(({ icon, onClick }) => {
											return (
												<div
													className={`CustomList_Body_Item_Icons_${icon.displayName}`}
													key={listItem._id + icon.displayName}
												>
													{React.createElement(icon, { onClick: onClick.bind(null, [ listItem._id || index ]) })}
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
			<List totalItems={this.props.listItems.length}>
				{(props) => {
					Object.entries(props).forEach(([ key, value ]) => (this[key] = value));

					return this.props.children
						? this.props.children({
								list: renderList(),
								checked: props.checked,
								selectedIndex: props.selectedIndex
							})
						: renderList();
				}}
			</List>
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
