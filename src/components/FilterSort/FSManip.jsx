import React, { Component, Fragment } from 'react';
import axios from 'axios';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import InputSelect from '../Input/InputSelect';
import TextInput from '../Input/TextInput/TextInput';
import CancelIcon from '@material-ui/icons/Cancel';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';
import UpdateIcon from '@material-ui/icons/Update';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

class FSManip extends Component {
	state = {
		filtersorts: [],
		currentPreset: null,
		presetName: ''
	};

	componentDidMount() {
		this.fetchPreset();
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.type !== this.props.type) {
			this.setState(
				{
					currentPreset: null
				},
				() => {
					this.fetchPreset();
				}
			);
		}
	}

	setFilterSort = (e) => {
		const { filters, sorts } = this.state.filtersorts.find(({ _id }) => _id === e.target.value);
		this.props.setFilterSort({
			filters,
			sorts
		});
		this.setState({
			currentPreset: this.state.filtersorts.find(({ _id }) => _id === e.target.value)
		});
	};

	createPreset = (e) => {
		const { presetName } = this.state;
		const { filters, sorts } = this.props;

		axios
			.post(
				`http://localhost:5001/api/v1/filtersort`,
				{
					filters,
					sorts,
					type: this.props.type.charAt(0).toUpperCase(0) + this.props.type.substr(1),
					name: presetName !== '' ? presetName : Date.now()
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data } }) => {
				if (presetName === '')
					this.changeResponse('Warning', 'You provided no value for preset name. Using current timestamp', 'warning');
				setTimeout(() => {
					this.changeResponse('Success', `Successfully created preset ${data.name}`, 'success');
				}, 1250);
				this.fetchPreset();
			})
			.catch((err) => {
				this.changeResponse('An error occurred', `${err.message}`, 'error');
			});
	};

	deletePreset = () => {
		const { currentPreset } = this.state;

		if (currentPreset) {
			axios
				.delete(`http://localhost:5001/api/v1/filtersort/${currentPreset._id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then(({ data: { data } }) => {
					this.changeResponse('Success', `Successfully deleted preset ${currentPreset.name}`, 'success');
					this.fetchPreset({
						currentPreset: null
					});
				});
		}
	};

	fetchPreset = (newState) => {
		let { type } = this.props;
		type = type.charAt(0).toUpperCase() + type.substr(1);
		axios
			.get(`http://localhost:5001/api/v1/filtersort/me?type=${type}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: filtersorts } }) => {
				this.setState({
					filtersorts,
					...newState
				});
			});
	};

	updatePreset = (e) => {
		const { currentPreset, presetName } = this.state;
		const { filters, sorts } = this.props;

		if (currentPreset) {
			axios
				.put(
					`http://localhost:5001/api/v1/filtersort/${currentPreset._id}`,
					{
						filters,
						sorts,
						type: this.props.type.charAt(0).toUpperCase(0) + this.props.type.substr(1),
						name: presetName !== '' ? presetName : Date.now()
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
				.then(({ data: { data } }) => {
					if (presetName === '')
						this.changeResponse('Warning', 'You provided no value for preset name. Using current timestamp', 'warning');
					setTimeout(() => {
						this.changeResponse('Success', `Successfully updated preset ${data.name}`, 'success');
					}, 1250);
					this.fetchPreset();
				})
				.catch((err) => {
					this.changeResponse('An error occurred', `${err.message}`, 'error');
				});
		}
	};

	resetFS = () => {
		this.setState(
			{
				currentPreset: null,
				presetName: ''
			},
			() => {
				this.props.setFilterSort({
					filters: [
						{
							target: 'none',
							mod: 'none',
							value: '',
							disabled: false,
							cond: 'and',
							shutdown: false,
							children: []
						}
					],
					sorts: [
						{
							target: 'none',
							order: 'none',
							disabled: false
						}
					]
				});
			}
		);
	};

	renderFSManip = () => {
		const { filtersorts, currentPreset, presetName } = this.state;
		return (
			<Fragment>
				<div className="FilterSort_icons">
					<RotateLeftIcon className="FilterSort_reset" onClick={this.resetFS} />
					<NoteAddIcon className="FilterSort_add" onClick={this.createPreset} />
					<UpdateIcon className="FilterSort_update" onClick={this.updatePreset} />
					<CancelIcon className="FilterSort_delete" onClick={this.deletePreset} />
				</div>
				<InputSelect
					className="FilterSort_preset"
					name="Preset"
					onChange={this.setFilterSort}
					selectItems={filtersorts.map(({ name, _id }) => ({
						value: _id,
						text: name
					}))}
					value={currentPreset ? currentPreset._id : null}
				/>
				<TextInput
					className="FilterSort_name"
					value={presetName}
					name={`Name`}
					onChange={(e) => {
						this.setState({
							presetName: e.target.value
						});
					}}
				/>
			</Fragment>
		);
	};
	render() {
		return (
			<CustomSnackbars>
				{({ changeResponse }) => {
					this.changeResponse = changeResponse;
					return this.props.children({
						FSManip: this.renderFSManip()
					});
				}}
			</CustomSnackbars>
		);
	}
}

export default FSManip;