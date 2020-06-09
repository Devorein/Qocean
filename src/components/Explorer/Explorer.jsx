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
		const { data, refetchData, totalCount, type, page } = this.props;
		return (
			<div className="Explorer">
				<Detailer data={data[detailerIndex]} type={type}>
					{({ fetchData, Detailer }) => {
						return (
							<Fragment>
								{Detailer}
								<div className="Displayer_container">
									<Manipulator
										onApply={(filterSorts) => {
											refetchData(type, filterSort(filterSorts));
										}}
										type={type}
									>
										{({ Manipulator, filter_sort }) => {
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
														updateDataLocally={(data) => this.setState({ data })}
													/>
												</Fragment>
											);
										}}
									</Manipulator>
								</div>
							</Fragment>
						);
					}}
				</Detailer>

				{formFillerIndex !== null ? (
					<FormFiller
						isOpen={isFormFillerOpen}
						user={this.context.user}
						handleClose={() => {
							this.setState({ isFormFillerOpen: false });
						}}
						submitMsg={'Update'}
						onSubmit={this.context.updateResource.bind(null, data[formFillerIndex]._id, refetchData)}
						type={type}
						data={data[formFillerIndex]}
						onArrowClick={this.switchData}
					/>
				) : null}
			</div>
		);
	}
}

export default Explorer;
