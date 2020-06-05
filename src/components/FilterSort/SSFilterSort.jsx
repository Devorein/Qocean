import React, { Component, Fragment } from 'react';
import GenericButton from '../Buttons/GenericButton';
import CancelIcon from '@material-ui/icons/Cancel';
import InputSelect from '../Input/InputSelect';
import Menu from '@material-ui/core/Menu';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { withTheme } from '@material-ui/core';
import './SSFilterSort.scss';

const DEFAULT_SORT = {
	target: 'none',
	order: 'none'
};

const DEFAULT_FILTER = {
	target: 'none',
	order: 'none'
};

class SSFilterSort extends Component {
	state = {
		filters: [ { ...DEFAULT_FILTER } ],
		sorts: [ { ...DEFAULT_SORT } ]
	};

	renderSortItem = (index) => {
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
		else if (type === 'question')
			selectItems = [ ...commonsorts, 'difficulty', 'type', 'subject', 'time_allocated', 'quiz' ];
		else if (type === 'folder')
			selectItems = [ ...commonsorts, 'icon', 'watchers', 'total_quizzes', 'total_questions' ];
		else if (type === 'environment') selectItems = [ ...commonsorts, 'icon' ];

		selectItems = selectItems.map((name) => ({
			value: name,
			text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
		}));

		return (
			<Fragment>
				<InputSelect
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
					value={this.state.sorts[index].target}
				/>
				<InputSelect
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
				/>
			</Fragment>
		);
	};

	renderFilterItem = (index) => {
		return <div>Filter {index}</div>;
	};

	renderFilterSortItem = () => {
		return [ 'filters', 'sorts' ].map((item, index) => {
			return (
				<div className={`FilterSortItem FilterSort--${item}`} key={`${item}${index}`}>
					<div
						className={`FilterSortItem_name`}
						onClick={(e) => {
							this.setState({
								anchorEl: e.currentTarget
							});
						}}
					>{`${item}`}</div>
					<Menu
						anchorEl={this.state.anchorEl}
						keepMounted
						open={Boolean(this.state.anchorEl)}
						onClose={(e) => {
							this.setState({
								anchorEl: null
							});
						}}
						PopoverClasses={{
							paper: 'SSFilterSort-popover'
						}}
					>
						{this.state[item].map((_, index) => {
							return (
								<div className="FilterSortSortsItem" key={`${this.state[item][index].target}${index}`}>
									{item === 'filters' ? this.renderFilterItem(index) : this.renderSortItem(index)}
									{index !== 0 ? (
										<CancelIcon
											onClick={() => {
												this.state[item].splice(index, 1);
												this.setState({
													[item]: this.state[item]
												});
											}}
											style={{ color: this.props.theme.palette.error.main }}
										/>
									) : null}
								</div>
							);
						})}
						{this.state[item].length < 3 ? (
							<div className="SSFilterSort_apply-button">
								<AddBoxIcon
									style={{ color: this.props.theme.palette.success.main }}
									onClick={(e) => {
										this.state[item].push(item === 'filters' ? { ...DEFAULT_FILTER } : { ...DEFAULT_SORT });
										this.setState({
											[item]: this.state[item]
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
