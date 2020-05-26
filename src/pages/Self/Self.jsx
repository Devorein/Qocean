import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTabs from '../../components/Tab/Tabs';
import axios from 'axios';
import pluralize from 'pluralize';
import SelfQuizzes from './SelfQuizzes';
import SelfQuestions from './SelfQuestions';
import SelfFolders from './SelfFolders';
import SelfEnvironments from './SelfEnvironments';
import deleteResource from '../../operations/deleteResource';
import updateResource from '../../operations/updateResource';
import { withSnackbar } from 'notistack';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import LinearList from '../../components/List/LinearList';
import './Self.scss';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import IconRow from '../../components/Row/IconRow';

class Self extends Component {
	state = {
		data: [],
		type: this.props.user.current_environment.default_self_landing,
		rowsPerPage: this.props.user.current_environment.default_self_rpp,
		page: 0,
		totalCount: 0,
		selectedData: null
	};

	componentDidMount() {
		this.refetchData(this.state.type, {
			limit: this.state.rowsPerPage,
			page: this.state.page
		});
	}

	refetchData = (type, queryParams) => {
		type = type ? type : this.state.type;
		queryParams = queryParams
			? queryParams
			: {
					limit: this.state.rowsPerPage,
					page: this.state.page
				};
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
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/countMine`, {
				...headers
			})
			.then(({ data: { data: totalCount } }) => {
				axios
					.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/me${queryString}`, {
						...headers
					})
					.then(({ data: { data } }) => {
						this.setState({
							data,
							type,
							totalCount,
							page: 0
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.refetchData(page.name, {
			limit: 15
		});
	};

	deleteResource = (selectedRows) => {
		const { type } = this.state;
		const { enqueueSnackbar } = this.props;
		const CLASS = this;
		let current = 0;
		let done = false;
		function reductiveDownloadChain(items) {
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					current++;
					const { _id, name } = currentItem;
					deleteResource(type, _id).then(({ data }) => {
						enqueueSnackbar(`${type} ${name} has been deleted`, {
							variant: 'success'
						});
						if (current === selectedRows.length && !done) {
							CLASS.refetchData();
							done = true;
						}
					});
				});
			}, Promise.resolve());
		}
		reductiveDownloadChain(selectedRows);
	};

	updateResource = (selectedRows, field) => {
		const { type } = this.state;
		const { enqueueSnackbar } = this.props;
		const CLASS = this;
		let current = 0;
		let done = false;
		function reductiveDownloadChain(items) {
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					current++;
					const { _id, name } = currentItem;
					updateResource(type, _id, {
						[field]: !currentItem[field]
					}).then(({ data }) => {
						enqueueSnackbar(`${type} ${name} has been updated`, {
							variant: 'success'
						});
						if (current === selectedRows.length && !done) {
							CLASS.refetchData();
							done = true;
						}
					});
				});
			}, Promise.resolve());
		}
		reductiveDownloadChain(selectedRows);
	};

	genericTransformData = (data, filterData) => {
		return data.map((item, index) => {
			return {
				...item,
				name: (
					<IconRow>
						<UpdateIcon />
						<InfoIcon
							onClick={(e) => {
								this.getDetails(filterData(item), index);
							}}
						/>
						<div>{item.name || item.question}</div>
					</IconRow>
				),
				public: item.public ? <PublicIcon style={{ fill: '#00a3e6' }} /> : <PublicIcon style={{ fill: '#f4423c' }} />,
				favourite: item.favourite ? (
					<StarIcon style={{ fill: '#f0e744' }} />
				) : (
					<StarBorderIcon style={{ fill: '#ead50f' }} />
				)
			};
		});
	};

	getDetails = ({ exclude, primary }, index) => {
		this.setState({
			selectedData: {
				exclude,
				primary,
				data: this.state.data[index]
			}
		});
	};

	decideTable = () => {
		const { getDetails, genericTransformData } = this;
		const { page, rowsPerPage, totalCount, type } = this.state;
		const CLASS = this;
		const options = {
			customToolbarSelect(selectedRows, displayData, setSelectedRows) {
				return (
					<div>
						<DeleteIcon
							onClick={(e) => {
								selectedRows = selectedRows.data.map(({ index }) => CLASS.state.data[index]);
								CLASS.deleteResource(selectedRows);
							}}
						/>
						<StarIcon
							onClick={(e) => {
								selectedRows = selectedRows.data.map(({ index }) => CLASS.state.data[index]);
								CLASS.updateResource(selectedRows, 'favourite');
							}}
						/>
						<PublicIcon
							onClick={(e) => {
								selectedRows = selectedRows.data.map(({ index }) => CLASS.state.data[index]);
								CLASS.updateResource(selectedRows, 'public');
							}}
						/>
					</div>
				);
			},
			filterType: 'checkbox',
			count: totalCount,
			page,
			customToolbar() {
				return <div>Custom Toolbar</div>;
			},
			rowsPerPage,
			responsive: 'scrollMaxHeight',
			rowsPerPageOptions: [ 10, 15, 20, 30, 40, 50 ],
			print: false,
			download: false,
			onRowsDelete() {
				return false;
			},
			serverSide: true,
			onChangePage: (page) => {
				this.setState(
					{
						page
					},
					() => {
						this.refetchData(type, {
							limit: rowsPerPage,
							page
						});
					}
				);
			},
			onChangeRowsPerPage: (rowsPerPage) => {
				this.setState(
					{
						rowsPerPage
					},
					() => {
						this.refetchData(type, {
							limit: rowsPerPage,
							page
						});
					}
				);
			}
		};

		const props = {
			limit: rowsPerPage,
			refetchData: this.refetchData,
			data: this.state.data,
			options,
			page,
			getDetails,
			genericTransformData
		};

		if (type === 'Quiz') return <SelfQuizzes {...props} />;
		else if (type === 'Question') return <SelfQuestions {...props} />;
		else if (type === 'Folder') return <SelfFolders {...props} />;
		else if (type === 'Environment') return <SelfEnvironments {...props} />;
	};

	render() {
		const { data, selectedData } = this.state;

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
				<div className={`self_${type}_content self_content`}>
					{data.length > 0 ? (
						<div className={`self_${type}_table self_content_table`}>{this.decideTable()}</div>
					) : (
						<div>You've not created any {type} yet</div>
					)}
					<div className={`self_${type}_list--linear self_content_list`}>
						<LinearList selectedData={selectedData} />
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(withSnackbar(Self));
