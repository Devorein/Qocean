import React, { Component, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import Composer from 'react-composer';

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
		const { submitForm, transformList, transformData } = this;
		return (
			<Composer
				components={[
					<PageSwitcher
						page="Import"
						runAfterSwitch={() => {
							this.resetUploadState();
							this.resetListState();
						}}
					/>,
					({ results, render }) => (
						<Upload msg={`Import ${results[0].type}`} accept={'application/json'} children={render} />
					),
					({ results, render }) => {
						let transformedData = [];
						if (results[1].UploadState.data)
							transformedData = transformData(results[0].type, results[1].UploadState.data);
						this.currentType = results[0].type;
						this.transformedData = transformedData;
						return (
							<CustomList
								listItems={transformList()}
								icons={[
									{
										icon: 'publish',
										onClick: submitForm,
										popoverText: 'Create item'
									}
								]}
								children={render}
							/>
						);
					}
				]}
			>
				{(ComposedProps) => {
					ComposedProps.forEach((ComposedProp) => {
						if (ComposedProp) Object.entries(ComposedProp).forEach(([ key, value ]) => (this[key] = value));
					});
					const { CustomTabs, type, Upload, selectedIndex, list, transformedData } = this;

					return (
						<div className={`Import Import-${type} page`}>
							{CustomTabs}
							{Upload}
							{transformedData.length !== 0 ? (
								<div className="Import_Content">
									{list}
									<FormFiller useModal={false} type={type} page={'Import'} data={transformedData[selectedIndex]} />
								</div>
							) : (
								<div className="Import_nocontent">Nothing imported</div>
							)}
						</div>
					);
				}}
			</Composer>
		);
	}
}

export default withSnackbar(Import);
