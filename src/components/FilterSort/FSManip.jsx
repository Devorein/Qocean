import React, { Component, Fragment } from 'react';
import axios from 'axios';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import InputSelect from '../Input/InputSelect';
import TextInput from '../Input/TextInput/TextInput';
import CancelIcon from '@material-ui/icons/Cancel';

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
			currentPreset: e.target.value
		});
	};

	createFilterSortPreset = (e) => {
		const { presetName } = this.state;
		const { filters, sorts } = this.props;
		axios
			.post(
				`http://localhost:5001/api/v1/filtersort`,
				{
					filters,
					sorts,
					type: this.props.type.charAt(0).toUpperCase(0) + this.props.type.substr(1),
					name: presetName
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then((data) => {
				this.fetchPreset();
			});
	};

	deletePreset = () => {
		const { currentPreset } = this.state;

		if (currentPreset) {
			axios
				.delete(`http://localhost:5001/api/v1/filtersort/${currentPreset}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
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

	renderFSManip = () => {
		const { filtersorts, currentPreset, presetName } = this.state;

		return (
			<Fragment>
				<NoteAddIcon className="FilterSort_add" onClick={this.createFilterSortPreset} />
				<CancelIcon onClick={this.deletePreset} />
				<InputSelect
					className="FilterSort_preset"
					name="Preset"
					onChange={(e) => {
						this.setFilterSort(e);
					}}
					selectItems={filtersorts.map(({ name, _id }) => ({
						value: _id,
						text: name
					}))}
					value={currentPreset}
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
		return this.props.children({
			FSManip: this.renderFSManip()
		});
	}
}

export default FSManip;
