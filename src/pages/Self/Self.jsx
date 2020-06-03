import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTabs from '../../components/Tab/Tabs';
import axios from 'axios';
import pluralize from 'pluralize';
import SelfQuizzes from './SelfQuizzes';
import SelfQuestions from './SelfQuestions';
import SelfFolders from './SelfFolders';
import SelfEnvironments from './SelfEnvironments';
import { withSnackbar } from 'notistack';
import { AppContext } from '../../context/AppContext';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import LinearList from '../../components/List/LinearList';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import FormFiller from '../FormFiller/FormFiller';
import ModalRP from '../../RP/ModalRP';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import shortid from 'shortid';
import download from '../../Utils/download';
import GetAppIcon from '@material-ui/icons/GetApp';
import './Self.scss';

class Self extends Component {
	static contextType = AppContext;
	state = {
		data: [],
		type: this.props.user.current_environment.default_self_landing,
		rowsPerPage: this.props.user.current_environment.default_self_rpp,
		page: 0,
		totalCount: 0,
		selectedData: null,
		sortCol: null,
		sortOrder: null,
		isOpen: false,
		selectedRows: []
	};

	componentDidMount() {
		this.refetchData(this.state.type, {
			limit: this.state.rowsPerPage,
			page: this.state.page
		});
	}

	refetchData = (type, queryParams, newState = {}) => {
		type = type ? type : this.state.type;
		queryParams = queryParams
			? queryParams
			: {
					limit: this.state.rowsPerPage,
					page: this.state.page
				};
		if (type === 'Question') {
			queryParams.populate = 'quiz';
			queryParams.populateFields = 'name';
		}
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
			sortOrder: null,
			selectedData: null,
			selectedRows: []
		});
	};

	deleteResource = (selectedRows) => {
		const { type } = this.state;
		const deleteResources = (selectedRows) => {
			const target = pluralize(type, 2).toLowerCase();
			return axios.delete(`http://localhost:5001/api/v1/${target}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					[target]: selectedRows
				}
			});
		};

		if (type === 'Environment') {
			let containsCurrent = false;
			const temp = [];
			selectedRows.forEach((selectedRow) => {
				if (selectedRow === this.props.user.current_environment._id) containsCurrent = true;
				else temp.push(selectedRow);
			});
			if (containsCurrent) {
				this.context.changeResponse(
					'Cant delete',
					'You are trying to delete a currently activated environment',
					'error'
				);
			}
			if (selectedRows.length > 1)
				deleteResources(temp).then(({ data: { data } }) => {
					setTimeout(() => {
						this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
					}, 2500);
					this.refetchData();
				});
		} else
			deleteResources(selectedRows).then(({ data: { data } }) => {
				this.context.changeResponse('Success', `Successfully deleted ${data} items`, 'success');
				this.refetchData();
			});
	};

	updateResource = (selectedRows, field) => {
		selectedRows = selectedRows.map((row) => ({ id: row._id, body: { [field]: !row[field] } }));
		let { type } = this.state;
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
				this.setState({
					data: this.state.data.map((data) => {
						const updatedData = updatedDatas.find((updatedData) => updatedData._id === data._id);
						if (updatedData) data[field] = updatedData[field];
						return data;
					})
				});
			});
	};

	transformData = (data) => {
		let { type } = this.state;
		type = type.toLowerCase();

		if (type === 'question') {
			return axios
				.put(
					'http://localhost:5001/api/v1/questions/_/answers',
					{
						questions: data.map(({ _id }) => _id)
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
				.then(({ data: { data: answers } }) => {
					const dataWithAnswers = data.map((data, index) => ({ ...data, answers: answers[index].answers }));
					return transformData(dataWithAnswers);
				});
		} else return new Promise((resolve, reject) => resolve(transformData(data)));

		function transformData(datas) {
			return datas.map((data) => {
				const negate = [ 'user', '_id', '__v', 'id' ];
				const temp = {};
				if (type === 'quiz')
					negate.push(
						'average_quiz_time',
						'average_difficulty',
						'total_questions',
						'total_folders',
						'folders',
						'rating',
						'questions',
						'watchers',
						'ratings',
						'raters'
					);
				else if (type === 'question') negate.push('quiz');
				else if (type === 'folder') negate.push('quizzes', 'ratings', 'total_questions', 'total_quizzes');

				const fields = Object.keys(data).filter((key) => negate.indexOf(key) === -1);
				fields.forEach((field) => (temp[field] = data[field]));
				temp.rtype = type.toLowerCase();
				return temp;
			});
		}
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
			selectedData: {
				exclude,
				primary,
				data: this.state.data[index]
			},
			...newState
		});
	};

	decideTable = (setDeleteModal) => {
		const { getDetails, genericTransformData, refetchData, updateResource } = this;
		const { page, rowsPerPage, totalCount, type, sortCol, sortOrder } = this.state;
		const options = {
			customToolbar: () => {
				return (
					<div>
						<RotateLeftIcon
							onClick={(e) => {
								refetchData();
							}}
						/>
						<StarIcon
							onClick={(e) => {
								updateResource(this.state.data, 'favourite');
							}}
						/>
						<PublicIcon
							onClick={(e) => {
								updateResource(this.state.data, 'public');
							}}
						/>
						<GetAppIcon
							onClick={(e) => {
								this.transformData(this.state.data).then((data) => {
									download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
								});
							}}
						/>
					</div>
				);
			},
			customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
				return (
					<div>
						<DeleteIcon
							onClick={(e) => {
								this.setState(
									{
										selectedRows: selectedRows.data.map((selectedRow) => selectedRow.index)
									},
									() => {
										setDeleteModal(true);
									}
								);
							}}
						/>
						<StarIcon
							onClick={(e) => {
								selectedRows = selectedRows.data.map(({ index }) => this.state.data[index]);
								updateResource(selectedRows, 'favourite');
							}}
						/>
						<PublicIcon
							onClick={(e) => {
								selectedRows = selectedRows.data.map(({ index }) => this.state.data[index]);
								updateResource(selectedRows, 'public');
							}}
						/>
						<GetAppIcon
							onClick={(e) => {
								this.transformData(selectedRows.data.map(({ index }) => this.state.data[index])).then((data) => {
									download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(data));
								});
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
			filter: false,
			search: false,
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
			limit: rowsPerPage,
			refetchData,
			data: this.state.data,
			options,
			page,
			getDetails,
			sortCol,
			sortOrder,
			genericTransformData,
			cols: [ { name: 'actions', label: 'Actions' } ]
		};

		if (type === 'Quiz') return <SelfQuizzes {...props} />;
		else if (type === 'Question') return <SelfQuestions {...props} />;
		else if (type === 'Folder') return <SelfFolders {...props} />;
		else if (type === 'Environment') return <SelfEnvironments {...props} />;
	};

	deleteModalMessage = () => {
		const { selectedRows, type, data } = this.state;
		return (
			<Fragment>
				<div>
					Youre about to delete the following {selectedRows.length} {type.toLowerCase()}(s)
				</div>
				{selectedRows.map((selectedRow) => <div key={data[selectedRow]._id}>{data[selectedRow].name}</div>)}
			</Fragment>
		);
	};

	render() {
		const { deleteModalMessage, refetchData } = this;
		const { data, selectedData, isOpen } = this.state;
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `self/${header}`
			};
		});
		return (
			<div className="Self page">
				<ModalRP
					onClose={(e) => {
						this.setState({
							selectedRows: []
						});
					}}
					onAccept={() => {
						const selectedDatas = this.state.selectedRows.map((index) => this.state.data[index]._id);
						this.deleteResource(selectedDatas);
						this.setState({
							selectedRows: []
						});
					}}
					modalMsg={deleteModalMessage()}
				>
					{({ setIsOpen }) => (
						<Fragment>
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
									<div className={`self_${type}_table self_content_table`}>{this.decideTable(setIsOpen)}</div>
								) : (
									<div>You've not created any {type} yet</div>
								)}
								<div className={`self_${type}_list--linear self_content_list`}>
									<LinearList selectedData={selectedData} />
								</div>
							</div>
						</Fragment>
					)}
				</ModalRP>

				<FormFiller
					isOpen={isOpen}
					user={this.props.user}
					handleClose={() => {
						this.setState({ isOpen: false });
					}}
					submitMsg={'Update'}
					onSubmit={this.context.updateResource.bind(null, selectedData ? selectedData.data._id : null, refetchData)}
					type={type}
					data={selectedData ? selectedData.data : null}
				/>
			</div>
		);
	}
}

export default withRouter(withSnackbar(Self));
