import React, { Component, Fragment } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
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
import axios from 'axios';
import pluralize from 'pluralize';
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

	updateResource = (selectedRows, field) => {
		selectedRows = selectedRows.map((row) => ({ id: row._id, body: { [field]: !row[field] } }));
		let { type } = this.props;
		type = pluralize(type, 2).toLowerCase();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}`,
				{
					[type]: selectedRows
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data: updatedDatas } }) => {
				this.context.changeResponse('Success', `Successfully updated ${updatedDatas.length} ${type}`);
				this.props.updateDataLocally(
					this.props.data.map((data) => {
						const updatedData = updatedDatas.find((updatedData) => updatedData._id === data._id);
						if (updatedData) data[field] = updatedData[field];
						return data;
					})
				);
			});
	};

	transformData = (data, selectedIndex) => {
		return data.map((item, index) => {
			const temp = {
				...item,
				checked: selectedIndex.includes(index),
				actions: (
					<Fragment>
						<UpdateIcon
							onClick={(e) => {
								this.props.enableFormFiller(index);
							}}
						/>
						<InfoIcon
							onClick={(e) => {
								this.props.setDetailerIndex(index);
							}}
						/>
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
					<PublicIcon onClick={this.updateResource.bind(null, [ item ], 'public')} style={{ fill: '#00a3e6' }} />
				) : (
					<PublicIcon onClick={this.updateResource.bind(null, [ item ], 'public')} style={{ fill: '#f4423c' }} />
				);
			if (item.watchers) temp.watchers = item.watchers.length;
			if (item.favourite !== undefined)
				temp.favourite = item.favourite ? (
					<StarIcon onClick={this.updateResource.bind(null, [ item ], 'favourite')} style={{ fill: '#f0e744' }} />
				) : (
					<StarBorderIcon onClick={this.updateResource.bind(null, [ item ], 'favourite')} style={{ fill: '#ead50f' }} />
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
		const { decideDisplayer, getCols, updateResource } = this;
		const { data, totalCount, page, refetchData, type } = this.props;
		const cols = getCols(data);
		return (
			<div className="Displayer">
				<Effector
					updateResource={updateResource}
					type={type}
					page={page}
					data={data}
					totalCount={totalCount}
					refetchData={refetchData}
					cols={cols}
				>
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
			</div>
		);
	}
}

export default Displayer;
