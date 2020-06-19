import React, { Component, Fragment } from 'react';

import { AppContext } from '../../context/AppContext';
import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';
import Detailer from './Detailer/Detailer';
import FormFiller from '../../pages/FormFiller/FormFiller';
import DataView from '../DataView/DataView';

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

	renderDetailer = (DataViewState, DataViewSelect) => {
		const { isFormFillerOpen, formFillerIndex, detailerIndex } = this.state;
		const { data, refetchData, totalCount, type, page, updateDataLocally, hideDetailer = false } = this.props;
		const formFillerMsg = page === 'Self' ? 'Update' : 'Create';

		return (
			<Detailer page={page} data={data[detailerIndex]} type={type} detailerLocation={DataViewState}>
				{({ fetchData, Detailer }) => {
					return (
						<div className="Explorer_content">
							{hideDetailer ? null : Detailer}
							<div className="Displayer_container">
								<Manipulator
									onApply={(filterSorts) => {
										refetchData(filterSort(filterSorts));
									}}
									type={type}
									page={page}
									DataViewSelect={DataViewSelect}
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
													hideDetailer={hideDetailer}
													updateDataLocally={updateDataLocally}
													customHandlers={this.props.customHandlers}
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
														refetchData={refetchData.bind(null, filterSort(filter_sort))}
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
						</div>
					);
				}}
			</Detailer>
		);
	};

	render() {
		const { type, page, hideDetailer = false } = this.props;

		return (
			<div className="Explorer">
				{!hideDetailer ? (
					<DataView displayComponent="explorer" type={type} page={page}>
						{({ DataViewSelect, DataViewState }) => {
							return <Fragment>{this.renderDetailer(DataViewState, DataViewSelect)}</Fragment>;
						}}
					</DataView>
				) : (
					this.renderDetailer({ view: 'left' }, null)
				)}
			</div>
		);
	}
}

export default Explorer;
