import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTabs from '../../components/Tab/Tabs';
import axios from 'axios';
import pluralize from 'pluralize';
import SelfQuizzes from './SelfQuizzes';
import SelfQuestions from './SelfQuestions';
import SelfFolders from './SelfFolders';
import SelfEnvironments from './SelfEnvironments';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import download from '../../Utils/download';
import GetAppIcon from '@material-ui/icons/GetApp';
import filterSort from '../../Utils/filterSort';
import Explorer from '../../components/Explorer/Explorer';
import shortid from 'shortid';
import qs from 'qs';

import './Self.scss';

class Self extends Component {
	state = {
		data: [],
		type: this.props.user.current_environment.default_self_landing,
		totalCount: 0
	};

	refetchData = (type, queryParams, newState = {}) => {
		type = type ? type : this.state.type;
		if (type === 'Question') {
			queryParams.populate = 'quiz';
			queryParams.populateFields = 'name';
			queryParams.select = '%2Banswers';
		}

		const queryString = qs.stringify(queryParams);
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/countMine`, {
				...headers
			})
			.then(({ data: { data: totalCount } }) => {
				axios
					.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/me?${queryString}`, {
						...headers
					})
					.then(({ data: { data } }) => {
						this.setState({
							data,
							totalCount,
							...newState
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.refetchData(page.name, null, {
			type: page.name,
			page: 0,
			selectedData: null,
			selectedRows: []
		});
	};

	genericTransformData = (data, filterData) => {
		return data.map((item, index) => {
			return {
				...item,
				actions: (
					<Fragment>
						<UpdateIcon
							onClick={(e) => {
								this.getDetails(filterData(item), index, { isOpen: true });
							}}
						/>
						<InfoIcon
							onClick={(e) => {
								this.getDetails(filterData(item), index);
							}}
						/>
						<GetAppIcon
							onClick={(e) => {
								this.transformData([ item ]).then((data) => {
									download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
								});
							}}
						/>
					</Fragment>
				),
				public: item.public ? (
					<PublicIcon onClick={this.updateResource.bind(null, [ item ], 'public')} style={{ fill: '#00a3e6' }} />
				) : (
					<PublicIcon onClick={this.updateResource.bind(null, [ item ], 'public')} style={{ fill: '#f4423c' }} />
				),
				favourite: item.favourite ? (
					<StarIcon onClick={this.updateResource.bind(null, [ item ], 'favourite')} style={{ fill: '#f0e744' }} />
				) : (
					<StarBorderIcon onClick={this.updateResource.bind(null, [ item ], 'favourite')} style={{ fill: '#ead50f' }} />
				)
			};
		});
	};

	getDetails = ({ exclude, primary }, index, newState = {}) => {
		this.setState({
			selectedIndex: index,
			...newState
		});
	};

	decideTable = (setDeleteModal) => {
		const { getDetails, genericTransformData, refetchData } = this;
		const { page, rowsPerPage, type } = this.state;

		const props = {
			limit: rowsPerPage,
			refetchData,
			data: this.state.data,
			page,
			getDetails,
			genericTransformData,
			cols: [ { name: 'actions', label: 'Actions' } ]
		};

		if (type === 'Quiz') return <SelfQuizzes {...props} />;
		else if (type === 'Question') return <SelfQuestions {...props} />;
		else if (type === 'Folder') return <SelfFolders {...props} />;
		else if (type === 'Environment') return <SelfEnvironments {...props} />;
	};

	applyFilterSort = (filter_sort) => {
		const query = filterSort(filter_sort);
		if (Object.keys(query).length > 0) this.refetchData(null, query);
	};

	render() {
		const { refetchData } = this;
		const { data, totalCount } = this.state;
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `self/${header}`
			};
		});
		return (
			<div className="Self page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				<Explorer page={'Self'} data={data} totalCount={totalCount} type={type} refetchData={refetchData} />
			</div>
		);
	}
}

export default withRouter(Self);
