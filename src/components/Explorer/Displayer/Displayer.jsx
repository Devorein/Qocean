import React, { Component, Fragment } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import Detailer from '../Detailer/Detailer';
import FormFiller from '../../../pages/FormFiller/FormFiller';
import { AppContext } from '../../../context/AppContext';

class Displayer extends Component {
	static contextType = AppContext;

	state = {
		view: 'table',
		selectedIndex: [],
		detailerIndex: 0,
		formFillerIndex: null,
		isFormFillerOpen: false
	};

	componentDidMount() {
		this.props.refetchData(this.state.type, {
			limit: this.context.user.current_environment.default_self_rpp,
			page: 1
		});
	}

	decideDisplayer = () => {
		const { view } = this.state;
		const { indieEffectors } = this.props;
		if (view === 'table') return <TableDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'list') return <ListDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'board') return <BoardDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'gallery') return <GalleryDisplayer indieEffectors={indieEffectors} />;
	};

	switchData = (dir, e) => {
		const { exclude, primary } = this.state.selectedData;
		const { data, selectedIndex, totalCount } = this.state;
		if (dir === 'right') {
			const newSelectedIndex = selectedIndex < totalCount - 1 ? selectedIndex + 1 : 0;
			this.setState({
				selectedData: {
					exclude,
					primary,
					data: data[newSelectedIndex]
				},
				selectedIndex: newSelectedIndex
			});
		} else if (dir === 'left') {
			const newSelectedIndex = selectedIndex > 0 ? selectedIndex - 1 : totalCount - 1;
			this.setState({
				selectedData: {
					exclude,
					primary,
					data: data[newSelectedIndex]
				},
				selectedIndex: newSelectedIndex
			});
		}
	};

	render() {
		const { decideDisplayer, switchData } = this;
		const { detailerIndex, selectedIndex, isFormFillerOpen, formFillerIndex } = this.state;
		const { data, totalCount, page, refetchData, type } = this.props;
		return (
			<div className="Displayer">
				<Effector
					type={type}
					page={page}
					totalCount={totalCount}
					selectedIndex={selectedIndex}
					refetchData={refetchData}
				>
					{({ EffectorTopBar, EffectorBottomBar }) => {
						return (
							<Fragment>
								{EffectorTopBar}
								{EffectorBottomBar}
							</Fragment>
						);
					}}
				</Effector>
				{decideDisplayer()}
				<Detailer data={data[detailerIndex]} />
				<FormFiller
					isOpen={isFormFillerOpen}
					user={this.context.user}
					handleClose={() => {
						this.setState({ isOpen: false });
					}}
					submitMsg={'Update'}
					onSubmit={this.context.updateResource.bind(null, formFillerIndex ? data[formFillerIndex] : null, refetchData)}
					type={type}
					data={formFillerIndex ? data[formFillerIndex] : null}
					onArrowClick={switchData}
				/>
			</div>
		);
	}
}

export default Displayer;
