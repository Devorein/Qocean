import React, { Component } from 'react';
import { AppContext } from '../../context/AppContext';
import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';
import Detailer from './Detailer/Detailer';
import FormFiller from '../../pages/FormFiller/FormFiller';

import './Explorer.scss';

class Explorer extends Component {
	static contextType = AppContext;
	state = {
		detailerIndex: 0,
		formFillerIndex: 0,
		isFormFillerOpen: false
	};

	switchData = (dir, e) => {
		const { formFillerIndex } = this.state;
		const { data } = this.props;
		if (dir === 'right') {
			const newSelectedIndex = formFillerIndex < data.length - 1 ? formFillerIndex + 1 : 0;
			this.setState({
				formFillerIndex: newSelectedIndex
			});
		} else if (dir === 'left') {
			const newSelectedIndex = formFillerIndex > 0 ? formFillerIndex - 1 : data.length - 1;
			this.setState({
				formFillerIndex: newSelectedIndex
			});
		}
	};

	render() {
		const { isFormFillerOpen, formFillerIndex } = this.state;
		const { data, refetchData, totalCount, type, page } = this.props;
		return (
			<div className="Explorer">
				<Detailer data={data[this.state.detailerIndex]} />
				<div className="Displayer_container">
					<Manipulator onApply={refetchData} type={type} />
					<Displayer
						setDetailerIndex={(detailerIndex) => {
							this.setState({ detailerIndex });
						}}
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
					/>
				</div>
				<FormFiller
					isOpen={isFormFillerOpen}
					user={this.context.user}
					handleClose={() => {
						this.setState({ isFormFillerOpen: false });
					}}
					submitMsg={'Update'}
					onSubmit={this.context.updateResource.bind(null, formFillerIndex ? data[formFillerIndex] : null, refetchData)}
					type={type}
					data={data[formFillerIndex]}
					onArrowClick={this.switchData}
				/>
			</div>
		);
	}
}

export default Explorer;
