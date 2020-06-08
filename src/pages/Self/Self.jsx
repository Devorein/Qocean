import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTabs from '../../components/Tab/Tabs';
import axios from 'axios';
import pluralize from 'pluralize';
import SelfQuizzes from './SelfQuizzes';
import SelfQuestions from './SelfQuestions';
import SelfFolders from './SelfFolders';
import SelfEnvironments from './SelfEnvironments';
import Explorer from '../../components/Explorer/Explorer';
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
			// queryParams.select = '%2Banswers';
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
		this.refetchData(
			page.name,
			{ page: 1, limit: this.props.user.current_environment.default_self_rpp },
			{
				type: page.name
			}
		);
	};

	decideTable = (setDeleteModal) => {
		const { refetchData } = this;
		const { page, rowsPerPage, type } = this.state;

		const props = {
			limit: rowsPerPage,
			refetchData,
			data: this.state.data,
			page
		};

		if (type === 'Quiz') return <SelfQuizzes {...props} />;
		else if (type === 'Question') return <SelfQuestions {...props} />;
		else if (type === 'Folder') return <SelfFolders {...props} />;
		else if (type === 'Environment') return <SelfEnvironments {...props} />;
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
