import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';
import CustomTabs from '../../components/Tab/Tabs';
import ExploreUsers from './ExploreUsers';
import ExploreQuizzes from './ExploreQuizzes';
import ExploreQuestions from './ExploreQuestions';
import ExploreFolders from './ExploreFolders';
import ExploreEnvironments from './ExploreEnvironments';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import FormFiller from '../FormFiller/FormFiller';
import { AppContext } from '../../context/AppContext';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

class Explore extends Component {
	static contextType = AppContext;
	state = {
		data: [],
		type: this.props.user ? this.props.user.current_environment.default_explore_landing.toLowerCase() : 'user',
		rowsPerPage: this.props.user ? this.props.user.current_environment.default_explore_rpp : 15,
		totaCount: 0,
		page: 0,
		sortCol: null,
		sortOrder: null,
		selectedIndex: null
	};

	componentDidMount() {
		this.refetchData(this.state.type, {
			limit: this.state.rowsPerPage,
			page: this.state.page
		});
	}
	getRelatedData = (type, queryParams) => {
		if (type === 'quiz' || type === 'folder' || type === 'environment') {
			queryParams.populate = 'user';
			queryParams.populateFields = 'username';
		} else if (type === 'question') {
			queryParams.populate = 'user,quiz';
			queryParams.populateFields = 'username-name';
		}

		return queryParams;
	};

	refetchData = (type, queryParams, newState = {}) => {
		type = type ? type : this.state.type;

		queryParams = queryParams
			? queryParams
			: {
					limit: this.state.rowsPerPage,
					page: this.state.page
				};
		queryParams = this.getRelatedData(type, queryParams);
		if (this.state.sortCol && Object.keys(newState).length === 0)
			queryParams.sort = (this.state.sortOrder === 'desc' ? '-' : '') + this.state.sortCol;
		const queryString = queryParams
			? '?' +
				Object.keys(queryParams)
					.map((key) => key + '=' + (key === 'page' ? parseInt(queryParams[key]) + 1 : queryParams[key]))
					.join('&')
			: '';

		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
		const [ count, endpoint, header ] = this.props.user
			? [ `countOthers`, '/others/', headers ]
			: [ 'countAll', '/', {} ];
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/${count}`, { ...header })
			.then(({ data: { data: totalCount } }) => {
				axios
					.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}${endpoint}${queryString}`, { ...header })
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
			sortCol: null,
			sortOrder: null
		});
	};

	genericTransformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				action: (
					<NoteAddIcon
						onClick={(e) => {
							this.setState({
								isOpen: true,
								selectedIndex: index
							});
						}}
					/>
				)
			};
		});
	};

	decideTable = () => {
		const { refetchData, genericTransformData } = this;
		const { page, rowsPerPage, totalCount, sortCol, sortOrder, type } = this.state;
		const options = {
			customToolbar() {
				return (
					<div>
						<RotateLeftIcon
							onClick={(e) => {
								refetchData();
							}}
						/>
					</div>
				);
			},
			filterType: 'checkbox',
			count: totalCount,
			page,
			rowsPerPage,
			responsive: 'scrollMaxHeight',
			rowsPerPageOptions: [ 10, 15, 20, 30, 40, 50 ],
			print: false,
			download: false,
			serverSide: true,
			onChangePage: (page) => {
				this.setState(
					{
						page
					},
					() => {
						refetchData();
					}
				);
			},
			onChangeRowsPerPage: (rowsPerPage) => {
				this.setState(
					{
						rowsPerPage
					},
					() => {
						refetchData();
					}
				);
			},
			onColumnSortChange: (changedColumn, order) => {
				this.setState(
					{
						sortCol: changedColumn,
						sortOrder: order === 'descending' ? 'desc' : 'asc'
					},
					() => {
						refetchData();
					}
				);
			}
		};

		const props = {
			data: genericTransformData(this.state.data),
			options,
			page,
			sortCol,
			sortOrder,
			cols: [ { name: 'action', label: 'Action' } ],
			refetchData,
			changeResponse: this.context.changeResponse,
			user: this.props.user
		};

		if (type === 'user') return <ExploreUsers {...props} />;
		else if (type === 'quiz') return <ExploreQuizzes {...props} />;
		else if (type === 'question') return <ExploreQuestions {...props} />;
		else if (type === 'folder') return <ExploreFolders {...props} />;
		else if (type === 'environment') return <ExploreEnvironments {...props} />;
	};

	render() {
		const { data, isOpen, selectedIndex } = this.state;

		const { match: { params: { type } } } = this.props;
		const { submitForm } = this.context;

		const headers = [ 'user', 'quiz', 'question', 'folder', 'environment' ].map((header) => {
			return {
				name: header,
				link: `explore/${header}`
			};
		});

		return (
			<div className="explore page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				{data.length > 0 ? this.decideTable() : <div>Loading data</div>}
				<FormFiller
					isOpen={isOpen ? isOpen : false}
					user={this.props.user}
					handleClose={() => {
						this.setState({ isOpen: false });
					}}
					submitMsg={'Create'}
					type={type}
					onSubmit={submitForm}
					data={data[selectedIndex] ? data[selectedIndex] : null}
				/>
			</div>
		);
	}
}

export default withRouter(Explore);
