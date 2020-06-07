import React, { Component, Fragment } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import Detailer from '../Detailer/Detailer';
import FormFiller from '../../../pages/FormFiller/FormFiller';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';
import ChipContainer from '../../../components/Chip/ChipContainer';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import download from '../../../Utils/download';
import GetAppIcon from '@material-ui/icons/GetApp';
import shortid from 'shortid';
import moment from 'moment';

class Displayer extends Component {
	static contextType = AppContext;

	state = {
		view: 'list',
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

	transformData = (data) => {
		data.forEach((item) => {
			item.actions = (
				<Fragment>
					<UpdateIcon />
					<InfoIcon />
					<GetAppIcon
					// onClick={(e) => {
					// 	this.transformData([ item ]).then((data) => {
					// 		download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
					// 	});
					// }}
					/>
				</Fragment>
			);

			if (item.tags) data.tags = <ChipContainer chips={item.tags} type={'regular'} height={100} />;
			if (item.public)
				item.public = item.public ? (
					<PublicIcon /* onClick={this.updateResource.bind(null, [ item ], 'public')}*/ style={{ fill: '#00a3e6' }} />
				) : (
					<PublicIcon /* onClick={this.updateResource.bind(null, [ item ], 'public')}*/ style={{ fill: '#f4423c' }} />
				);
			if (item.favourite)
				item.favourite = item.favourite ? (
					<StarIcon /* onClick={this.updateResource.bind(null, [ item ], 'favourite')}*/ style={{ fill: '#f0e744' }} />
				) : (
					<StarBorderIcon
						/* onClick={this.updateResource.bind(null, [ item ], 'favourite')}*/ style={{ fill: '#ead50f' }}
					/>
				);
			if (item.created_at) item.created_at = moment(item.created_at).fromNow();
			if (item.updated_at) item.updated_at = moment(item.updated_at).fromNow();
		});

		return data;
	};

	decideDisplayer = () => {
		const { view } = this.state;
		const { data, type } = this.props;

		const props = {
			data: sectorizeData(this.transformData(data), type, this.context.user),
			type
		};

		if (view === 'table') return <TableDisplayer {...props} />;
		else if (view === 'list') return <ListDisplayer {...props} />;
		else if (view === 'board') return <BoardDisplayer {...props} />;
		else if (view === 'gallery') return <GalleryDisplayer {...props} />;
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
								{decideDisplayer()}
								{EffectorBottomBar}
							</Fragment>
						);
					}}
				</Effector>
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
