import React, { Component, Fragment } from 'react';
import { AppContext } from '../../context/AppContext';
import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';
import Detailer from './Detailer/Detailer';
import FormFiller from '../../pages/FormFiller/FormFiller';
import filterSort from '../../Utils/filterSort';
import './Explorer.scss';

class Explorer extends Component {
	static contextType = AppContext;
	state = {
		formFillerIndex: null,
		isFormFillerOpen: false
	};

	switchData = (dir, e) => {
		const { formFillerIndex } = this.state;
		const { data } = this.props;
		let newSelectedIndex = null;
		if (dir === 'right') newSelectedIndex = formFillerIndex < data.length - 1 ? formFillerIndex + 1 : 0;
		else if (dir === 'left') newSelectedIndex = formFillerIndex > 0 ? formFillerIndex - 1 : data.length - 1;

		this.setState({
			formFillerIndex: newSelectedIndex
		});
	};

	render() {
		const { isFormFillerOpen, formFillerIndex, detailerIndex } = this.state;
		const { data, refetchData, totalCount, type, page, updateDataLocally } = this.props;
		const formFillerMsg = page === 'Self' ? 'Update' : 'Create';

		return (
			<div className="Explorer">
				<Detailer page={page} data={data[detailerIndex]} type={type}>
					{({ fetchData, Detailer }) => {
						return (
							<Fragment>
								{Detailer}
								<div className="Displayer_container">
									<Manipulator
										onApply={(filterSorts) => {
											refetchData(filterSort(filterSorts));
										}}
										type={type}
									>
										{({ Manipulator, filter_sort }) => {
											let onSubmit =
												page !== 'Self'
													? this.context.submitForm
													: this.context.updateResource.bind(
															null,
															formFillerIndex !== null ? data[formFillerIndex]._id : '',
															refetchData.bind(null, filterSort(filter_sort))
														);
											return (
												<Fragment>
													{Manipulator}
													<Displayer
														filter_sort={filter_sort}
														fetchData={fetchData}
														refetchData={refetchData}
														page={page}
														data={data}
														totalCount={totalCount}
														type={type}
														enableFormFiller={(formFillerIndex) => {
															this.setState({
																isFormFillerOpen: true,
																formFillerIndex
															});
														}}
														updateDataLocally={updateDataLocally}
														resetFilterSort={resetFilterSort}
													/>
													{formFillerIndex !== null ? (
														<FormFiller
															page={page}
															isOpen={isFormFillerOpen}
															user={this.context.user}
															handleClose={() => {
																this.setState({ isFormFillerOpen: false });
															}}
															submitMsg={formFillerMsg}
															onSubmit={onSubmit}
															type={type}
															data={data[formFillerIndex]}
															onArrowClick={this.switchData}
														/>
													) : null}
												</Fragment>
											);
										}}
									</Manipulator>
								</div>
							</Fragment>
						);
					}}
				</Detailer>
			</div>
		);
	}
}

export default Explorer;
