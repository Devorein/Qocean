import React, { Component, Fragment } from 'react';
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
import { AppContext } from '../../context/AppContext';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import LinearList from '../../components/List/LinearList';
import './Self.scss';
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import IconRow from '../../components/Row/IconRow';
import Update from '../Update/Update';
import ModalRP from '../../RP/ModalRP';

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
		const CLASS = this;
		const { enqueueSnackbar } = this.props;
		const { type } = this.state;
		let current = 0;
		let done = false;

		if (type === 'Environment') {
			let containsCurrent = false;
			const temp = [];
			selectedRows.forEach((selectedRow) => {
				if (selectedRow._id === this.props.user.current_environment._id) containsCurrent = true;
				else temp.push(selectedRow);
			});
			if (containsCurrent) {
				this.context.changeResponse(
					'Cant delete',
					'You are trying to delete a currently activated environment',
					'error'
				);
			}
			reductiveDownloadChain(temp);
		} else reductiveDownloadChain(selectedRows);

		function reductiveDownloadChain(items) {
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					current++;
					const { _id, name } = currentItem;
					deleteResource(type, _id).then(({ data }) => {
						enqueueSnackbar(`${type} ${name} has been deleted`, {
							variant: 'success'
						});
						if (current === items.length && !done) {
							CLASS.refetchData();
							done = true;
						}
					});
				});
			}, Promise.resolve());
		}
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
						<div>{item.name}</div>
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
			limit: rowsPerPage,
			refetchData,
			data: this.state.data,
			options,
			page,
			getDetails,
			sortCol,
			sortOrder,
			genericTransformData
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
				{selectedRows.map((selectedRow) => <div>{data[selectedRow].name}</div>)}
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
						const selectedDatas = this.state.selectedRows.map((index) => this.state.data[index]);
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

				<Update
					isOpen={isOpen}
					user={this.props.user}
					handleClose={() => {
						this.setState({ isOpen: false });
					}}
					type={type}
					data={selectedData ? selectedData.data : null}
					refetchData={refetchData}
				/>
			</div>
		);
	}
}

export default withRouter(withSnackbar(Self));
