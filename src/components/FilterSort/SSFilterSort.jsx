import React, { Component, Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';
import shortid from 'shortid';
import Color from 'color';
import convert from 'color-convert';
import CancelIcon from '@material-ui/icons/Cancel';
import Menu from '@material-ui/core/Menu';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { withStyles } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import GenericButton from '../Buttons/GenericButton';
import InputSelect from '../Input/InputSelect';
import TextInput from '../Input/TextInput/TextInput';
import getColoredIcons from '../../Utils/getColoredIcons';
import DatePicker from '../Input/DatePicker';
import MultiSelect from '../Input/MultiSelect';
import decideTargetType from '../../Utils/decideTargetType';
import getPropsBasedOnType from '../../Utils/getSelectItemsBasedOnType';

import './SSFilterSort.scss';

const DEFAULT_FILTER = {
	target: 'none',
	mod: 'none',
	value: '',
	disabled: false,
	cond: 'and',
	shutdown: false
};

const DEFAULT_SORT = {
	target: 'none',
	order: 'none',
	disabled: false
};

function capitalize(item) {
	return item.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ');
}

class SSFilterSort extends Component {
	state = {
		filtersorts: [],
		filters: [ { ...DEFAULT_FILTER, children: [] } ],
		sorts: [ { ...DEFAULT_SORT } ],
		currentPreset: null
	};

	selectItems = [ { vaule: 'none', text: 'none' } ];

	fetchPreset = () => {
		let { type } = this.props;
		type = type.charAt(0).toUpperCase() + type.substr(1);
		axios
			.get(`http://localhost:5001/api/v1/filtersort/me?type=${type}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: filtersorts } }) => {
				this.setState({
					filtersorts
				});
			});
	};

	componentDidMount() {
		this.fetchPreset();
	}

	UNSAFE_componentWillReceiveProps(props) {
		this.selectItems = getPropsBasedOnType(props.type);

		if (props.type !== this.props.type) {
			this.setState(
				{
					filters: [ { ...DEFAULT_FILTER, children: [] } ],
					sorts: [ { ...DEFAULT_SORT } ],
					currentPreset: null
				},
				() => {
					this.fetchPreset();
				}
			);
		}
	}

	renderSortItem = (index) => {
		const currentTarget = this.state.sorts[index];
		const { disabled, target, order } = currentTarget;
		return (
			<Fragment>
				<div className="FilterSortItem_select_switch">
					<Switch
						name={`sort${index}`}
						checked={!disabled}
						color="primary"
						onChange={(e) => {
							currentTarget.disabled = !disabled;
							this.setState({
								sorts: this.state.sorts
							});
						}}
					/>
				</div>
				<InputSelect
					className="FilterSortItem_select_target"
					name="Target"
					onChange={(e) => {
						currentTarget.target = e.target.value;
						this.setState({
							sorts: this.state.sorts
						});
					}}
					selectItems={this.selectItems}
					disabledSelect={disabled}
					value={target}
				/>
				<InputSelect
					className="FilterSortItem_select_order"
					name="Order"
					value={order}
					onChange={(e) => {
						currentTarget.order = e.target.value;
						this.setState({
							sorts: this.state.sorts
						});
					}}
					selectItems={[
						{ value: 'asc', text: 'Ascending' },
						{ value: 'desc', text: 'Descending' },
						{ value: 'none', text: 'None' }
					]}
					disabledSelect={disabled}
				/>
				{index !== 0 ? (
					<div className="FilterSortItem_select_delete">
						<CancelIcon
							onClick={() => {
								if (!disabled) {
									this.state.sorts.splice(index, 1);
									this.setState({
										sorts: this.state.sorts
									});
								}
							}}
						/>
					</div>
				) : null}
			</Fragment>
		);
	};

	renderTargetValue = (targetType, targetItem) => {
		const { disabled, value, mod, target, shutdown } = targetItem;
		if (targetType === 'string')
			return (
				<TextInput
					value={value}
					name={`value`}
					disabled={disabled || shutdown}
					onChange={(e) => {
						targetItem.value = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
				/>
			);
		else if (targetType === 'boolean')
			return (
				<InputSelect
					name="Value"
					value={value ? value : ''}
					onChange={(e) => {
						targetItem.value = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
					selectItems={[ { value: 'true', text: 'True' }, { value: 'false', text: 'False' } ]}
					disabledSelect={disabled || shutdown}
				/>
			);
		else if (targetType === 'number') {
			return (
				<Fragment>
					{Array(
						mod.match(/^(between_exclusive|not_between_exclusive|between_inclusive|not_between_inclusive)$/g) ? 2 : 1
					)
						.fill(0)
						.map((_, _index) => (
							<TextInput
								disabled={disabled || shutdown}
								key={`${_index}_${targetType}_${mod}`}
								value={Array.isArray(value) && value[_index] ? value[_index] : []}
								name={`value`}
								type={'number'}
								onChange={(e) => {
									if (!Array.isArray(value)) targetItem.value = [];
									targetItem.value[_index] = e.target.value;
									this.setState({
										filters: this.state.filters
									});
								}}
							/>
						))}
				</Fragment>
			);
		} else if (targetType === 'select') {
			let selectItems = null;
			if (target.match(/(difficulty|average_difficulty)/))
				selectItems = [ 'Beginner', 'Intermediate', 'Advanced' ].map((item) => ({
					name: item,
					_id: item
				}));
			else if (target.match(/(type)/)) {
				selectItems = [
					{ name: 'Multi Select', _id: 'MS' },
					{ name: 'Multi Choice Question', _id: 'MCQ' },
					{ name: 'Fill in Blanks', _id: 'FIB' },
					{ name: 'Flashcard', _id: 'FC' },
					{ name: 'True/False', _id: 'TF' },
					{ name: 'Snippet', _id: 'Snippet' }
				];
			} else if (target === 'icon') {
				selectItems = [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ].map((color) => {
					const capitalized = color.charAt(0).toUpperCase() + color.substr(1);
					return {
						text: capitalized,
						_id: `${capitalized}_${this.props.type.toLowerCase()}.svg`,
						customText: getColoredIcons(this.props.type, color)
					};
				});
			} else if (target === 'version') {
				selectItems = [ 'Rower', 'Sailor', 'Captain' ].map((item) => ({
					name: item,
					_id: item
				}));
			}
			return (
				<MultiSelect
					disabled={disabled || shutdown}
					label={capitalize(target)}
					selected={Array.isArray(value) ? value : []}
					items={selectItems}
					customChipRenderer={target.match(/(icon)/) ? getColoredIcons.bind(null, this.props.type) : null}
					handleChange={(e) => {
						if (!Array.isArray(value)) targetItem.value = [];
						targetItem.value = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
				/>
			);
		} else if (targetType === 'date') {
			return mod.match(/^(exact|within)$/)
				? Array(mod.match(/^(exact)$/) ? 1 : 2).fill(0).map((_, _index) => (
						<DatePicker
							disabled={disabled || shutdown}
							key={`datepicker_${_index}${shortid.generate()}`}
							value={value[_index]}
							onChange={(date) => {
								target.value[_index] = date.toISOString();
								this.setState({
									filters: this.state.filters
								});
							}}
						/>
					))
				: null;
		} else return null;
	};

	renderFilterItem = (parentIndex, { isChild, childIndex, child }) => {
		let currentTarget = null,
			index = null;
		if (!isChild) {
			index = parentIndex;
			currentTarget = this.state.filters[index];
		} else {
			index = childIndex;
			currentTarget = child;
		}

		if (currentTarget) {
			const { target, mod, disabled, shutdown, children } = currentTarget;
			const [ targetType, modItems ] = decideTargetType(target);
			const valueItem = this.renderTargetValue(targetType, currentTarget);

			return (
				<div
					key={isChild ? `filter${index}_child${childIndex}` : `filter${index}`}
					className={`FilterSortItem_select_item`}
				>
					<div className="FilterSortItem_select_switch">
						<FormControlLabel
							disabled={shutdown}
							control={
								<Switch
									name={`${targetType}${index}`}
									checked={!disabled}
									color="primary"
									onChange={(e) => {
										currentTarget.disabled = !disabled;
										if (!isChild)
											children.forEach((child) => {
												child.shutdown = currentTarget.disabled;
											});
										this.setState({
											filters: this.state.filters
										});
									}}
								/>
							}
						/>
					</div>
					{(!isChild && index >= 1) || isChild ? (
						<InputSelect
							className="FilterSortItem_select_cond"
							name="Cond"
							value={currentTarget.cond}
							onChange={(e) => {
								let target = null;
								if (!child) target = this.state.filters;
								else target = this.state.filters[parentIndex].children;
								target.forEach((filter) => {
									filter.cond = e.target.value;
								});
								this.setState({
									filters: this.state.filters
								});
							}}
							disabledSelect={disabled || shutdown}
							selectItems={[ { value: 'and', text: 'AND' }, { value: 'or', text: 'OR' } ]}
						/>
					) : null}
					<InputSelect
						className="FilterSortItem_select_target"
						name="Target"
						value={target}
						onChange={(e) => {
							const [ targetType, modItems ] = decideTargetType(e.target.value);
							currentTarget.target = e.target.value;
							currentTarget.type = targetType;
							currentTarget.cond = this.state.filters[0].cond;
							currentTarget.mod = modItems[0].value;
							if (targetType === 'date') {
								const currentDate = moment(Date.now()).toISOString();
								if (currentTarget.mod === 'exact') currentTarget.value = [ currentDate ];
								else if (currentTarget.mod === 'within') currentTarget.value = [ currentDate, currentDate ];
							} else {
								currentTarget.value = (() => {
									if (targetType === 'string') return '';
									else if (targetType === 'number') return [ 0 ];
									else if (targetType === 'boolean') return true;
								})();
							}
							this.setState({
								filters: this.state.filters
							});
						}}
						disabledSelect={disabled || shutdown}
						selectItems={this.selectItems}
					/>
					<InputSelect
						className="FilterSortItem_select_mod"
						name="Mod"
						value={mod}
						onChange={(e) => {
							currentTarget.mod = e.target.value;
							this.setState({
								filters: this.state.filters
							});
						}}
						disabledSelect={disabled || shutdown}
						selectItems={modItems}
					/>
					<div className="FilterSortItem_select_value">{valueItem}</div>
					{index !== 0 || isChild ? (
						<div className="FilterSortItem_select_delete">
							<CancelIcon
								onClick={() => {
									if (!disabled && !shutdown) {
										if (isChild) this.state.filters[parentIndex].children.splice(childIndex, 1);
										else this.state.filters.splice(index, 1);
										this.setState({
											filters: this.state.filters
										});
									}
								}}
							/>
						</div>
					) : null}
					{!isChild && currentTarget.children.length < 2 ? (
						<AddBoxIcon
							className="FilterSortItem_select_add"
							onClick={(e) => {
								if (!disabled && !shutdown) {
									const newTarget = { ...DEFAULT_FILTER };
									delete newTarget.children;
									children.push(newTarget);
									this.setState({
										filters: this.state.filters
									});
								}
							}}
						/>
					) : null}
				</div>
			);
		}
	};

	renderFilterChildrens = (index) => {
		return this.state.filters[index].children.length !== 0
			? this.state.filters[index].children.map((child, childIndex) => {
					return (
						<div className={`FilterSortItem_select_filters_child`} key={`filter${index}_child${childIndex}`}>
							{this.renderFilterItem(index, { child, isChild: true, childIndex })}
						</div>
					);
				})
			: null;
	};

	renderFilterSortItem = () => {
		return [ 'filters', 'sorts' ].map((item) => {
			let totalActive = 0;

			this.state[item].forEach((item) => (totalActive += item.disabled ? 0 : 1));
			const items = this.state[item];
			return (
				<div className={`FilterSortItem FilterSort_${item}`} key={`${item}`}>
					<div
						className={`FilterSortItem_name`}
						onClick={(e) => {
							this.setState({
								[`anchorEl${item}`]: e.currentTarget
							});
						}}
					>
						{totalActive}/{this.state[item].length} {`${item}`}{' '}
						<span style={{ fontSize: 12, marginLeft: 5 }}>{'Active'}</span>
					</div>
					<Menu
						anchorEl={this.state[`anchorEl${item}`]}
						keepMounted
						open={Boolean(this.state[`anchorEl${item}`])}
						onClose={(e) => {
							this.setState({
								[`anchorEl${item}`]: null
							});
						}}
						PopoverClasses={{
							paper: `SSFilterSort-popover ${this.props.classes.root}`
						}}
					>
						{items.map(({ disabled, target }, index) => {
							return (
								<div
									className={`FilterSortItem_select FilterSortItem_select_${item} ${disabled
										? 'FilterSortItem_select--disabled'
										: ''}`}
									key={`${target}${index}`}
								>
									{item === 'filters' ? (
										<div
											className={`FilterSortItem_select_${item}_parent ${disabled
												? 'FilterSortItem_select--disabled'
												: ''}`}
										>
											{' '}
											{this.renderFilterItem(index, { isChild: false, childIndex: null })}
										</div>
									) : (
										this.renderSortItem(index)
									)}
									<div
										className={`FilterSortItem_select_${item}_childcontainer ${disabled
											? 'FilterSortItem_select--disabled'
											: ''}`}
									>
										{item === 'filters' ? this.renderFilterChildrens(index) : null}
									</div>
								</div>
							);
						})}
						{items.length < 5 ? (
							<div className="SSFilterSort_apply-button">
								<AddBoxIcon
									onClick={(e) => {
										items.push(
											item === 'filters'
												? { ...DEFAULT_FILTER, children: [], cond: this.state.filters[0].cond }
												: { ...DEFAULT_SORT }
										);
										this.setState({
											[item]: items
										});
									}}
								/>
							</div>
						) : null}
					</Menu>
				</div>
			);
		});
	};

	setFilterSort = (e) => {
		const { filters, sorts } = this.state.filtersorts.find(({ _id }) => _id === e.target.value);
		this.setState({
			currentPreset: e.target.value,
			filters,
			sorts
		});
	};

	createFilterSortPreset = (e) => {
		const { filters, sorts, presetName } = this.state;
		axios
			.post(
				`http://localhost:5001/api/v1/filtersort`,
				{
					filters,
					sorts,
					type: this.props.type.charAt(0).toUpperCase(0) + this.props.type.substr(1),
					name: presetName
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then((data) => {
				this.fetchPreset();
			});
	};

	renderFilterSort = () => {
		const { filtersorts, currentPreset, presetName } = this.state;
		return (
			<div className={`FilterSort`}>
				<NoteAddIcon className="FilterSort_add" onClick={this.createFilterSortPreset} />
				<InputSelect
					className="FilterSort_preset"
					name="Preset"
					onChange={(e) => {
						this.setFilterSort(e);
					}}
					selectItems={filtersorts.map(({ name, _id }) => ({
						value: _id,
						text: name
					}))}
					value={currentPreset}
				/>
				<TextInput
					className="FilterSort_name"
					value={presetName}
					name={`Name`}
					onChange={(e) => {
						this.setState({
							presetName: e.target.value
						});
					}}
				/>
				<div className="FilterSortContainer">{this.renderFilterSortItem()}</div>
				<GenericButton onClick={this.props.onApply.bind(null, this.state)} text="Apply" />
			</div>
		);
	};

	render() {
		const { passFSAsProp = true } = this.props;
		const { filters, sorts } = this.state;
		if (this.props.children) {
			return this.props.children({
				SSFilterSort: passFSAsProp ? this.renderFilterSort() : null,
				filter_sort: {
					filters,
					sorts
				}
			});
		} else return this.renderFilterSort();
	}
}

export default withStyles((theme) => ({
	root: {
		'& .FilterSortItem_select_delete': {
			color: theme.palette.error.main
		},
		'& .FilterSortItem_select_add': {
			color: theme.palette.success.main
		},
		'& .SSFilterSort_apply-button': {
			color: theme.palette.success.main
		},
		'& .FilterSortItem_select_filters_parent': {
			backgroundColor: theme.palette.background.dark
		},
		'& .FilterSortItem_select_filters_childcontainer': {
			marginLeft: 20,
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.15).hex()
		}
	}
}))(SSFilterSort);
