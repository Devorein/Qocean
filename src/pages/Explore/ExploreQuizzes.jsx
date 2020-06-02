import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import ChipContainer from '../../components/Chip/ChipContainer';
import StarsIcon from '@material-ui/icons/Stars';
import ModalRP from '../../RP/ModalRP';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';

class ExploreQuizzes extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols.concat(
			[
				{ name: 'ratings', sort: true, filter: true },
				{ name: 'name', sort: true, filter: false },
				{ name: 'subject', sort: true, filter: false },
				{ name: 'average_quiz_time', sort: true, filter: true },
				{ name: 'average_difficulty', sort: true, filter: true },
				{ name: 'tags', sort: false, filter: false },
				{ name: 'source', sort: false, filter: false },
				{ name: 'total_questions', sort: true, filter: true },
				{ name: 'creator', sort: true, filter: false },
				{ name: 'created_at', sort: false, filter: false },
				{ name: 'total_played', sort: true, filter: false },
				{ name: 'updated_at', sort: false, filter: false }
			].map(({ name, sort, filter }) => {
				return {
					name,
					label: this.decideLabel(name),
					options: {
						filter,
						sort,
						sortDirection: name === this.props.sortCol ? this.props.sortOrder : 'none'
					}
				};
			})
		);
	};

	transformOption = (option) => {
		option.customToolbarSelect = (selectedRows) => {
			return (
				<InputForm
					formButtons={false}
					inputs={[ { type: 'number', name: 'ratings', defaultValue: 5, inputProps: { min: 0, max: 10, step: 0.1 } } ]}
					passFormAsProp={true}
				>
					{({ inputs, values: { ratings } }) => {
						return (
							<ModalRP
								modalMsg={inputs}
								onAccept={() => {
									selectedRows = selectedRows.data.map((selectedRow) => selectedRow.index);
									const quizzes = selectedRows.map((selectedRow) => this.props.data[selectedRow]._id);
									axios
										.put(
											`http://localhost:5001/api/v1/quizzes/_/ratings`,
											{
												quizzes,
												ratings: [ ratings ]
											},
											{
												headers: {
													Authorization: `Bearer ${localStorage.getItem('token')}`
												}
											}
										)
										.then(({ data }) => {
											console.log(data);
											this.props.refetchData();
											this.props.changeResponse(
												'Success',
												`Added ratings for ${data.total_rated.length} quizzes`,
												'success'
											);
										});
								}}
							>
								{({ setIsOpen }) => {
									return (
										<StarsIcon
											onClick={(e) => {
												setIsOpen(true);
												// console.log(selectedRows.data.map(({ index }) => index));
											}}
										/>
									);
								}}
							</ModalRP>
						);
					}}
				</InputForm>
			);
		};
		return option;
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				tags: <ChipContainer chips={item.tags} type={'regular'} />,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		let { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`Quiz List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default ExploreQuizzes;
