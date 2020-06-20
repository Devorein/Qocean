import React, { Component, Fragment } from 'react';
import { withSnackbar } from 'notistack';

import Upload from '../../components/Buttons/Upload';
import CustomList from '../../components/List/CustomList';
import FormFiller from '../FormFiller/FormFiller';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import submitForm from '../../operations/submitForm';

import './Import.scss';

class Import extends Component {
	transformData = (currentType, data) => {
		const { enqueueSnackbar } = this.props;
		if (data) {
			let items = JSON.parse(data);
			const itemname = [];
			return items.filter(({ rtype: importType, name }) => {
				const isUnique = itemname.indexOf(name) === -1;
				if (isUnique) itemname.push(name);
				if (!importType || !importType.match(/(quiz|environment|question|folder)/)) {
					enqueueSnackbar(`${name} doesnt have a type field`, {
						variant: 'error'
					});
					return false;
				} else if (importType !== currentType.toLowerCase()) {
					enqueueSnackbar(`${importType} ${name} is not of selected type`, {
						variant: 'error'
					});
					return false;
				} else if (!isUnique) {
					enqueueSnackbar(`${importType} ${name} has already been added`, {
						variant: 'error'
					});
					return false;
				} else return true;
			});
		} else return [];
	};

	transformList = () => {
		return this.transformedData.map((data) => {
			return {
				primary: data.name,
				primaryIcon: this.currentType
			};
		});
	};

	submitForm = (index) => {
		const { enqueueSnackbar } = this.props;
		const { currentType, transformedData } = this;

		function reductiveDownloadChain(items) {
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					submitForm(currentType, currentItem)
						.then(({ data: { data } }) => {
							enqueueSnackbar(`Successfully created ${currentType} ${data.name}`, {
								variant: 'success'
							});
						})
						.catch((err) => {
							enqueueSnackbar(`Error: ${err.response.data.error}`, {
								variant: 'error'
							});
						});
				});
			}, Promise.resolve());
		}

		reductiveDownloadChain(index.map((index) => transformedData[index]));
	};

	render() {
		return (
			<PageSwitcher
				page="Import"
				runAfterSwitch={() => {
					this.setState({
						selectedIndex: null
					});
				}}
			>
				{({ CustomTabs, type }) => (
					<Fragment>
						{CustomTabs}
						<Upload msg={`Import ${type}`} accept={'application/json'}>
							{({ Upload, data }) => {
								let transformedData = [];
								if (data) transformedData = this.transformData(type, data);
								this.currentType = type;
								this.transformedData = transformedData;
								return (
									<div className={`Import Import-${type}`}>
										{Upload}
										{transformedData.length !== 0 ? (
											<CustomList
												listItems={this.transformList()}
												icons={[
													{
														icon: 'publish',
														onClick: this.submitForm,
														popoverText: 'Create item'
													}
												]}
											>
												{({ selectedIndex, list }) => {
													return (
														<Fragment>
															{list}
															<FormFiller
																useModal={false}
																type={type}
																page={'Import'}
																data={transformedData[selectedIndex]}
															/>
														</Fragment>
													);
												}}
											</CustomList>
										) : (
											<div>Nothing imported</div>
										)}
									</div>
								);
							}}
						</Upload>
					</Fragment>
				)}
			</PageSwitcher>
		);
	}
}

export default withSnackbar(Import);
