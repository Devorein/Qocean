import React, { Component, Fragment } from 'react';
import GenericButton from '../Buttons/GenericButton';
import CancelIcon from '@material-ui/icons/Cancel';
import InputSelect from '../Input/InputSelect';
import Menu from '@material-ui/core/Menu';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { withTheme } from '@material-ui/core';
import TextInput from '../Input/TextInput/TextInput';
import getColoredIcons from '../../Utils/getColoredIcons';
import DatePicker from '../Input/DatePicker';
import Switch from '@material-ui/core/Switch';
import moment from 'moment';
import shortid from 'shortid';
import './SSFilterSort.scss';
import MultiSelect from '../Input/MultiSelect';

const DEFAULT_FILTER = {
	target: 'none',
	mod: 'none',
	value: '',
	disabled: false,
	cond: 'and'
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
		filters: [ { ...DEFAULT_FILTER } ],
		sorts: [ { ...DEFAULT_SORT } ]
	};

	getPropsBasedOnType = () => {
		let { type } = this.props;
		type = type.toLowerCase();
		const commonsorts = [ 'none', 'name', 'public', 'favourite', 'created_at', 'updated_at' ];

		let selectItems = null;
		if (type === 'quiz')
			selectItems = [
				...commonsorts,
				'ratings',
				'subject',
				'average_quiz_time',
				'average_difficulty',
				'tags',
				'watchers',
				'total_questions'
			];
		else if (type === 'question') selectItems = [ ...commonsorts, 'difficulty', 'type', 'time_allocated', 'quiz' ];
		else if (type === 'folder')
			selectItems = [ ...commonsorts, 'icon', 'watchers', 'total_quizzes', 'total_questions' ];
		else if (type === 'environment') selectItems = [ ...commonsorts, 'icon' ];
		return selectItems.map((name) => ({
			value: name,
			text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
		}));
	};

	renderSortItem = (index) => {
		const selectItems = this.getPropsBasedOnType();
		const currentTarget = this.state.sorts[index];
		const { disabled } = currentTarget;
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
						this.state.sorts.forEach((sort, _index) => {
							if (_index === index) sort.target = e.target.value;
						});
						this.setState({
							sorts: this.state.sorts
						});
					}}
					selectItems={selectItems}
					disabledSelect={disabled}
					value={this.state.sorts[index].target}
				/>
				<InputSelect
					className="FilterSortItem_select_order"
					name="Order"
					value={this.state.sorts[index].order}
					onChange={(e) => {
						this.state.sorts.forEach((sort, _index) => {
							if (_index === index) sort.order = e.target.value;
						});
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
			</Fragment>
		);
	};

	decideTargetType = (target) => {
		let targetType = null;
		if (target.match(/^(name|subject|quiz)$/)) targetType = 'string';
		else if (target.match(/^(public|favourite)$/)) targetType = 'boolean';
		else if (target.match(/^(created_at|updated_at)$/)) targetType = 'date';
		else if (target.match(/^(ratings|average_quiz_time|watchers|total_questions|time_allocated|total_quizzes)$/))
			targetType = 'number';
		else if (target.match(/^(tags)$/)) targetType = 'array';
		else if (target.match(/(difficulty|icon|type|average_difficulty)$/)) targetType = 'select';
		return targetType;
	};

	decideFilterItem = (targetType, index) => {
		const { disabled } = this.state.filters[index];
		if (targetType === 'string')
			return [
				[ 'is', 'starts_with', 'ends_with', 'contains', 'regex' ].map((name) => ({
					value: name,
					text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
				})),
				<TextInput
					value={this.state.filters[index].value}
					name={`value`}
					disabled={disabled}
					onChange={(e) => {
						const target = this.state.filters[index];
						target.value = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
				/>
			];
		else if (targetType === 'boolean')
			return [
				[ { value: 'is', text: 'Is' }, { value: 'is_not', text: 'Is not' } ],
				<InputSelect
					name="Value"
					value={this.state.filters[index].value ? this.state.filters[index].value : ''}
					onChange={(e) => {
						this.state.filters.forEach((filter, _index) => {
							if (_index === index) filter.value = e.target.value;
						});
						this.setState({
							filters: this.state.filters
						});
					}}
					selectItems={[ { value: 'true', text: 'True' }, { value: 'false', text: 'False' } ]}
					disabledSelect={disabled}
				/>
			];
		else if (targetType === 'number') {
			const { mod } = this.state.filters[index];
			return [
				[
					'is',
					'is_not',
					'greater_than',
					'less_than',
					'greater_than_equal',
					'less_than_equal',
					'between_inclusive',
					'between_exclusive',
					'not_between_inclusive',
					'not_between_exclusive'
				].map((name) => ({
					value: name,
					text: capitalize(name)
				})),
				<Fragment>
					{Array(
						mod.match(/^(between_exclusive|not_between_exclusive|between_inclusive|not_between_inclusive)$/g) ? 2 : 1
					)
						.fill(0)
						.map((_, _index) => (
							<TextInput
								disabled={disabled}
								key={`${_index}_${targetType}_${mod}`}
								value={
									Array.isArray(this.state.filters[index].value) && this.state.filters[index].value[_index] ? (
										this.state.filters[index].value[_index]
									) : (
										[]
									)
								}
								name={`value`}
								type={'number'}
								onChange={(e) => {
									const target = this.state.filters[index];
									if (!Array.isArray(target.value)) target.value = [];
									target.value[_index] = e.target.value;
									this.setState({
										filters: this.state.filters
									});
								}}
							/>
						))}
				</Fragment>
			];
		} else if (targetType === 'select') {
			const { target, value = [] } = this.state.filters[index];
			return [
				[ 'is', 'is_not' ].map((name) => ({
					value: name,
					text: capitalize(name)
				})),
				<MultiSelect
					disabled={disabled}
					label={capitalize(target)}
					selected={Array.isArray(value) ? value : []}
					items={
						target.match(/(difficulty|average_difficulty)/) ? (
							[ 'Beginner', 'Intermediate', 'Advanced' ].map((item) => ({
								name: item,
								_id: item
							}))
						) : target.match(/(type)/) ? (
							[
								{ name: 'Multi Select', _id: 'MS' },
								{ name: 'Multi Choice Question', _id: 'MCQ' },
								{ name: 'Fill in Blanks', _id: 'FIB' },
								{ name: 'Flashcard', _id: 'FC' },
								{ name: 'True/False', _id: 'TF' },
								{ name: 'Snippet', _id: 'Snippet' }
							]
						) : (
							[ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ].map((color) => {
								const capitalized = color.charAt(0).toUpperCase() + color.substr(1);
								return {
									text: capitalized,
									_id: `${capitalized}_${this.props.type.toLowerCase()}.svg`,
									customText: getColoredIcons(this.props.type, color)
								};
							})
						)
					}
					customChipRenderer={target.match(/(icon)/) ? getColoredIcons.bind(null, this.props.type) : null}
					handleChange={(e) => {
						const target = this.state.filters[index];
						if (!Array.isArray(target.value)) target.value = [];
						target.value = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
				/>
			];
		} else if (targetType === 'date') {
			const { mod } = this.state.filters[index];
			return [
				[
					'exact',
					'today',
					'yesterday',
					'within',
					'last_week',
					'within_last_week',
					'last_month',
					'within_last_month',
					'last_year',
					'within_last_year'
				].map((item) => ({ value: item, text: capitalize(item) })),
				mod.match(/^(exact|within)$/)
					? Array(mod.match(/^(exact)$/) ? 1 : 2).fill(0).map((_, _index) => (
							<DatePicker
								disabled={disabled}
								key={`datepicker_${_index}${shortid.generate()}`}
								value={this.state.filters[index].value[_index]}
								onChange={(date) => {
									const target = this.state.filters[index];
									target.value[_index] = date.toISOString();
									this.setState({
										filters: this.state.filters
									});
								}}
							/>
						))
					: null
			];
		} else return [ [ { value: 'none', text: 'None' } ], null ];
	};
	renderFilterItem = (index) => {
		const selectItems = this.getPropsBasedOnType();
		const currentTarget = this.state.filters[index];
		const { target, mod, disabled } = currentTarget;

		const targetType = this.decideTargetType(target);
		const [ modItems, valueItem ] = this.decideFilterItem(targetType, index);
		const modValue = mod !== 'none' ? mod : modItems[0].value;
		return (
			<Fragment>
				<div className="FilterSortItem_select_switch">
					<Switch
						name={`${targetType}${index}`}
						checked={!disabled}
						color="primary"
						onChange={(e) => {
							currentTarget.disabled = !disabled;
							this.setState({
								filters: this.state.filters
							});
						}}
					/>
				</div>
				{index >= 1 ? (
					<InputSelect
						className="FilterSortItem_select_cond"
						name="Cond"
						value={currentTarget.cond}
						onChange={(e) => {
							currentTarget.cond = e.target.value;
							this.setState({
								filters: this.state.filters
							});
						}}
						disabledSelect={disabled}
						selectItems={[ { value: 'and', text: 'AND' }, { value: 'or', text: 'OR' } ]}
					/>
				) : null}
				<InputSelect
					className="FilterSortItem_select_target"
					name="Target"
					value={target}
					onChange={(e) => {
						const targetType = this.decideTargetType(e.target.value);
						const [ modItems ] = this.decideFilterItem(targetType, index);

						currentTarget.target = e.target.value;
						currentTarget.type = targetType;
						currentTarget.cond = 'and';
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
					disabledSelect={disabled}
					selectItems={selectItems}
				/>
				<InputSelect
					className="FilterSortItem_select_mod"
					name="Mod"
					value={modValue}
					onChange={(e) => {
						currentTarget.mod = e.target.value;
						this.setState({
							filters: this.state.filters
						});
					}}
					disabledSelect={disabled}
					selectItems={modItems}
				/>
				<div className="FilterSortItem_select_value">{valueItem}</div>
			</Fragment>
		);
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
							paper: 'SSFilterSort-popover'
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
									{item === 'filters' ? this.renderFilterItem(index) : this.renderSortItem(index)}
									{index !== 0 ? (
										<CancelIcon
											onClick={() => {
												if (!disabled) {
													items.splice(index, 1);
													this.setState({
														[item]: items
													});
												}
											}}
											style={{ color: this.props.theme.palette.error.main }}
										/>
									) : null}
								</div>
							);
						})}
						{items.length < 3 ? (
							<div className="SSFilterSort_apply-button">
								<AddBoxIcon
									style={{ color: this.props.theme.palette.success.main }}
									onClick={(e) => {
										items.push(item === 'filters' ? { ...DEFAULT_FILTER } : { ...DEFAULT_SORT });
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

	renderFilterSort = () => {
		return (
			<div className="FilterSort">
				<div className="FilterSortContainer">{this.renderFilterSortItem()}</div>
				<GenericButton onClick={this.props.onApply.bind(null, this.state)} text="Apply" />
			</div>
		);
	};

	render() {
		return this.props.children({
			filterSort: this.renderFilterSort()
		});
	}
}

export default withTheme(SSFilterSort);
