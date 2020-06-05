import React, { Component, Fragment } from 'react';
import GenericButton from '../Buttons/GenericButton';
import CancelIcon from '@material-ui/icons/Cancel';
import InputSelect from '../Input/InputSelect';
import './SSFilterSort.scss';

class SSFilterSort extends Component {
	state = {
		filters: [ null ],
		sorts: [
			{
				target: 'none',
				order: 'none'
			}
		]
	};

	renderSortItem = (index) => {
		let { type } = this.props;
		type = type.toLowerCase();
		const { sorts } = this.state;
		const sort = sorts[index];

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
						sort.target = e.target.value;
						this.setState({
							sorts
						});
					}}
					selectItems={selectItems}
					value={sort.target}
				/>
				<InputSelect
					name="Order"
					value={sort.order}
					onChange={(e) => {
						sort.order = e.target.value;
						this.setState({
							sorts
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

	renderFilterSort = () => {
		return (
			<div className="FilterSort">
				<div className="FilterSortContainer">
					<div className="FilterSortItem FilterSort--filters">
						{this.state.filters.map((filter, index) => {
							return (
								<div className="FilterSortSortsItem" key={index}>
									Filter {index}
									{index !== 0 ? (
										<CancelIcon
											onClick={() => {
												const { filters } = this.state;
												filters.pop();
												this.setState({
													filters
												});
											}}
										/>
									) : null}
								</div>
							);
						})}
						{this.state.filters.length < 3 ? (
							<GenericButton
								text="Add Filter"
								onClick={(e) => {
									const { filters } = this.state;
									filters.push(null);
									this.setState({
										filters
									});
								}}
							/>
						) : null}
					</div>
					<div className="FilterSortItem FilterSort--sorts">
						{this.state.sorts.map((sort, index) => {
							return (
								<div className="FilterSortSortsItem" key={index}>
									{this.renderSortItem(index)}
									{index !== 0 ? (
										<CancelIcon
											onClick={() => {
												const { sorts } = this.state;
												sorts.pop();
												this.setState({
													sorts
												});
											}}
										/>
									) : null}
								</div>
							);
						})}
						{this.state.sorts.length < 2 ? (
							<GenericButton
								text="Add sort"
								onClick={(e) => {
									const { sorts } = this.state;
									sorts.push({
										target: 'none',
										order: 'none'
									});
									this.setState({
										sorts
									});
								}}
							/>
						) : null}
					</div>
				</div>
				<GenericButton onClick={this.props.onApply.bind(this.state)} text="Apply" />
			</div>
		);
	};

	render() {
		const { type } = this.props;
		return this.props.children({
			filterSort: this.renderFilterSort()
		});
	}
}

export default SSFilterSort;
