import React, { Component, Fragment } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import FormFiller from '../../../pages/FormFiller/FormFiller';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';
import ChipContainer from '../../../components/Chip/ChipContainer';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import getColouredIcons from '../../../Utils/getColoredIcons';
import exportData from '../../../Utils/exportData';
import moment from 'moment';
import './Displayer.scss';

class Displayer extends Component {
	static contextType = AppContext;

	state = {
		formFillerIndex: null,
		isFormFillerOpen: false
	};

	componentDidMount() {
		this.props.refetchData(this.state.type, {
			limit: this.context.user.current_environment.default_self_rpp,
			page: 1
		});
	}

	transformData = (data, selectedIndex) => {
		return data.map((item, index) => {
			const temp = {
				...item,
				checked: selectedIndex.includes(index),
				actions: (
					<Fragment>
						<UpdateIcon />
						<InfoIcon />
						<GetAppIcon
							onClick={(e) => {
								exportData(this.props.type, [ item ]);
							}}
						/>
					</Fragment>
				)
			};
			if (item.icon) temp.icon = getColouredIcons(this.props.type, item.icon);
			if (item.quiz) temp.quiz = item.quiz.name;
			if (item.user) temp.user = item.user.username;
			if (item.tags) temp.tags = <ChipContainer chips={item.tags} type={'regular'} height={50} />;
			if (item.public !== undefined)
				temp.public = item.public ? (
					<PublicIcon /* onClick={this.updateResource.bind(null, [ item ], 'public')}*/ style={{ fill: '#00a3e6' }} />
				) : (
					<PublicIcon /* onClick={this.updateResource.bind(null, [ item ], 'public')}*/ style={{ fill: '#f4423c' }} />
				);
			if (item.watchers) temp.watchers = item.watchers.length;
			if (item.favourite !== undefined)
				temp.favourite = item.favourite ? (
					<StarIcon /* onClick={this.updateResource.bind(null, [ item ], 'favourite')}*/ style={{ fill: '#f0e744' }} />
				) : (
					<StarBorderIcon
						/* onClick={this.updateResource.bind(null, [ item ], 'favourite')}*/ style={{ fill: '#ead50f' }}
					/>
				);

			if (item.created_at) temp.created_at = moment(item.created_at).fromNow();
			if (item.updated_at) temp.updated_at = moment(item.updated_at).fromNow();

			return temp;
		});
	};

	decideDisplayer = (data, view, setSelectedIndex) => {
		const { type } = this.props;

		const props = {
			data,
			type,
			setChecked: setSelectedIndex
		};

		if (view === 'table') return <TableDisplayer {...props} />;
		else if (view === 'list') return <ListDisplayer {...props} />;
		else if (view === 'board') return <BoardDisplayer {...props} />;
		else if (view === 'gallery') return <GalleryDisplayer {...props} />;
	};

	/* 	switchData = (dir, e) => {
		const { selectedIndex, totalCount } = this.state;
		if (dir === 'right') {
			const newSelectedIndex = selectedIndex < totalCount - 1 ? selectedIndex + 1 : 0;
			this.setState({
				selectedIndex: newSelectedIndex
			});
		} else if (dir === 'left') {
			const newSelectedIndex = selectedIndex > 0 ? selectedIndex - 1 : totalCount - 1;
			this.setState({
				selectedIndex: newSelectedIndex
			});
		}
	}; */

	getCols = (data) => {
		const cols = [];
		if (data.length > 0)
			Object.keys(
				sectorizeData(data[0], this.props.type, { authenticated: this.context.user, singular: true })
			).forEach((col) => {
				cols.push(col);
			});
		return cols;
	};

	render() {
		const { decideDisplayer, switchData, getCols } = this;
		const { isFormFillerOpen, formFillerIndex } = this.state;
		const { data, totalCount, page, refetchData, type } = this.props;
		const cols = getCols(data);
		return (
			<div className="Displayer">
				<Effector type={type} page={page} data={data} totalCount={totalCount} refetchData={refetchData} cols={cols}>
					{({ EffectorTopBar, EffectorBottomBar, view, removed_cols, setSelectedIndex, selectedIndex }) => {
						const manipulatedData = sectorizeData(this.transformData(data, selectedIndex), type, {
							authenticated: this.context.user,
							blacklist: removed_cols
						});

						return (
							<Fragment>
								{EffectorTopBar}
								<div className="Displayer_data">{decideDisplayer(manipulatedData, view, setSelectedIndex)}</div>
								{EffectorBottomBar}
							</Fragment>
						);
					}}
				</Effector>
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
